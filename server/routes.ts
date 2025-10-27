import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated as replitIsAuthenticated } from "./replitAuth";
import { authenticate, hashPassword, comparePassword, generateToken, checkSubscription } from "./auth";
import { PLANS } from "./stripe";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { conversionQueue } from "./conversionQueue";
import { insertConversionSchema } from "@shared/schema";
import { getR2DownloadUrl, isR2Available } from "./r2Storage";
import { exec } from "child_process";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const execAsync = promisify(exec);

// Check LibreOffice installation on startup (silently)
async function checkLibreOffice() {
  const libreOfficePaths = process.platform === 'win32'
    ? [
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
        'soffice',
      ]
    : [
        'soffice',
        '/usr/bin/soffice',
        '/usr/local/bin/soffice',
        'libreoffice',
        '/usr/bin/libreoffice',
      ];

  for (const libreOfficeCmd of libreOfficePaths) {
    try {
      const versionCmd = libreOfficeCmd.includes(' ')
        ? `"${libreOfficeCmd}" --version`
        : `${libreOfficeCmd} --version`;
      
      // Check version silently (suppress output)
      const { stdout } = await execAsync(versionCmd, { timeout: 5000 });
      console.log(`✓ LibreOffice detected: ${libreOfficeCmd} - ${stdout.trim()}`);
      return true;
    } catch {
      continue;
    }
  }

  console.error('❌ LibreOffice not found - Office to PDF conversion will not work');
  return false;
}

// Run LibreOffice check silently
checkLibreOffice().catch(() => {});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
const outputDir = path.join(process.cwd(), 'converted');

// Ensure directories exist
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);
fs.mkdir(outputDir, { recursive: true }).catch(console.error);

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = ['.docx', '.xlsx', '.pptx', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only .docx, .xlsx, .pptx, and .pdf files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Health check endpoint - verify all dependencies
  app.get('/api/health', async (req, res) => {
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        dependencies: {
          libreoffice: false,
          python: false,
          poppler: false,
          r2Storage: isR2Available(),
        },
        platform: process.platform,
      };

      // Check LibreOffice
      try {
        await checkLibreOffice();
        health.dependencies.libreoffice = true;
      } catch {}

      // Check Python
      let pythonCmd = '';
      try {
        await execAsync('python3 --version', { timeout: 5000 });
        pythonCmd = 'python3';
        health.dependencies.python = true;
      } catch {
        try {
          await execAsync('python --version', { timeout: 5000 });
          pythonCmd = 'python';
          health.dependencies.python = true;
        } catch {}
      }

      // Check Python packages if Python is available
      if (health.dependencies.python && pythonCmd) {
        try {
          const { stdout } = await execAsync(`${pythonCmd} -c "import pdf2docx, tabula, openpyxl, pptx, pdf2image; print('ok')"`, { timeout: 5000 });
          (health.dependencies as any).pythonPackages = stdout.includes('ok');
        } catch {
          (health.dependencies as any).pythonPackages = false;
        }
      }

      // Check Poppler
      try {
        await execAsync('pdftoppm -h', { timeout: 5000 });
        health.dependencies.poppler = true;
      } catch {}

      // Check Java
      try {
        await execAsync('java -version', { timeout: 5000 });
        (health.dependencies as any).java = true;
      } catch {
        (health.dependencies as any).java = false;
      }

      res.json(health);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Configure Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (!user) {
              const email = profile.emails?.[0]?.value;
              if (!email) {
                return done(new Error('No email from Google'));
              }

              user = await storage.createUser({
                email,
                googleId: profile.id,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                authProvider: 'google',
              });
            }
            
            done(null, user);
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }

  // Custom auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        authProvider: 'email',
      });

      const token = generateToken({ userId: user.id, email: user.email || email });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName,
          subscriptionPlan: user.subscriptionPlan 
        } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken({ userId: user.id, email: user.email || email });
      
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName,
          subscriptionPlan: user.subscriptionPlan 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  }));

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req: any, res) => {
      const email = req.user?.email;
      if (!email) {
        return res.redirect('/login?error=no_email');
      }
      const token = generateToken({ userId: req.user.id, email });
      res.redirect(`/?token=${token}`);
    }
  );

  app.get('/api/auth/user', authenticate, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Keep Replit auth for backward compatibility
  app.get('/api/auth/replit/user', replitIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Upload and convert document
  app.post('/api/conversions/upload', authenticate, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const file = req.file;
      const targetFormat = req.body.targetFormat; // 'pdf', 'word', 'excel', or 'ppt'

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileExt = path.extname(file.originalname).toLowerCase();
      const isPdfInput = fileExt === '.pdf';
      
      // Validate target format
      if (isPdfInput && !['word', 'excel', 'ppt'].includes(targetFormat)) {
        return res.status(400).json({ 
          message: 'For PDF input, please specify targetFormat: word, excel, or ppt' 
        });
      }

      // Create conversion record
      const conversion = await storage.createConversion({
        userId,
        originalFileName: file.originalname,
        fileSize: file.size,
        status: 'pending',
      });

      // Prepare paths
      const inputPath = file.path;
      let outputFileName: string;
      let outputExt: string;
      let conversionType: 'to-pdf' | 'from-pdf';

      if (isPdfInput) {
        // PDF to Office conversion
        conversionType = 'from-pdf';
        outputExt = targetFormat === 'word' ? '.docx' : targetFormat === 'excel' ? '.xlsx' : '.pptx';
        outputFileName = `${conversion.id}${outputExt}`;
      } else {
        // Office to PDF conversion
        conversionType = 'to-pdf';
        outputFileName = `${conversion.id}.pdf`;
      }

      const outputPath = path.join(outputDir, outputFileName);

      // Add conversion job to queue
      await conversionQueue.add({
        conversionId: conversion.id,
        inputPath,
        outputPath,
        conversionType,
        targetFormat: isPdfInput ? (targetFormat as 'word' | 'excel' | 'ppt') : undefined,
      });

      res.json(conversion);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Upload failed' 
      });
    }
  });

  // Get user's conversions
  app.get('/api/conversions', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userConversions = await storage.getUserConversions(userId);
      res.json(userConversions);
    } catch (error) {
      console.error('Error fetching conversions:', error);
      res.status(500).json({ message: 'Failed to fetch conversions' });
    }
  });

  // Get conversion statistics
  app.get('/api/conversions/stats', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getConversionStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Download converted PDF
  // Download converted file
  app.get('/api/conversions/:id/download', async (req: any, res) => {
    try {
      // Support token from both header and query parameter (for direct downloads)
      const tokenFromHeader = req.headers.authorization?.replace('Bearer ', '');
      const tokenFromQuery = req.query.token;
      const token = tokenFromHeader || tokenFromQuery;

      if (!token) {
        return res.status(401).json({ message: 'No authentication token provided' });
      }

      // Manually verify token since we're not using the authenticate middleware
      let userId: string;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        userId = decoded.userId;
      } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      const conversionId = req.params.id;
      const conversion = await storage.getConversionById(conversionId);

      if (!conversion) {
        return res.status(404).json({ message: 'Conversion not found' });
      }

      if (conversion.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      if (conversion.status !== 'completed' || !conversion.convertedFileName) {
        return res.status(400).json({ message: 'Conversion not completed' });
      }

      // If file is stored in R2, redirect to presigned URL
      if (conversion.storageType === 'r2' && conversion.r2Key) {
        try {
          const downloadUrl = await getR2DownloadUrl(conversion.r2Key, 3600); // 1 hour expiry
          return res.redirect(downloadUrl);
        } catch (r2Error) {
          console.error('Failed to get R2 download URL:', r2Error);
          // Fall back to local file if R2 fails
        }
      }

      // Fall back to local storage
      const filePath = path.join(outputDir, conversion.convertedFileName);

      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: 'File not found' });
      }

      res.download(filePath, conversion.convertedFileName);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: 'Download failed' });
    }
  });

  // Contact form submission (email sent to support, not displayed publicly)
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      // In a production environment, you would send an email here
      // For example, using nodemailer or a service like SendGrid
      // The recipient email (menarobir246rm@gmail.com) is stored securely in environment variables
      // and never exposed to the client
      
      const supportEmail = process.env.SUPPORT_EMAIL || 'menarobir246rm@gmail.com';
      
      // TODO: Implement email sending with nodemailer or similar service
      // Example:
      // await sendEmail({
      //   to: supportEmail,
      //   from: email,
      //   subject: `Contact Form: ${subject}`,
      //   html: `
      //     <h3>New Contact Form Submission</h3>
      //     <p><strong>From:</strong> ${name} (${email})</p>
      //     <p><strong>Subject:</strong> ${subject}</p>
      //     <p><strong>Message:</strong></p>
      //     <p>${message}</p>
      //   `
      // });

      // For now, log the contact request (in production, send actual email)
      console.log('Contact form submission:', {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        sendTo: supportEmail,
      });

      res.json({ 
        message: 'Thank you for your message! We will get back to you soon.',
        success: true 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
