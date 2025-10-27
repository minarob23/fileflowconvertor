import { storage } from './storage';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { uploadToR2, isR2Available, getContentType } from './r2Storage';

const execAsync = promisify(exec);

interface ConversionJob {
  conversionId: string;
  inputPath: string;
  outputPath: string;
  conversionType?: 'to-pdf' | 'from-pdf'; // Default: to-pdf
  targetFormat?: 'word' | 'excel' | 'ppt'; // For PDF to Office conversion
}

// Simple in-memory queue for async processing
class ConversionQueue {
  private processing = new Set<string>();
  private libreOfficeAvailable: boolean | null = null;

  async checkLibreOffice(): Promise<boolean> {
    if (this.libreOfficeAvailable !== null) {
      return this.libreOfficeAvailable;
    }

    try {
      // Try common LibreOffice paths on Windows
      const commonPaths = [
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
        'soffice',
      ];

      for (const cmd of commonPaths) {
        try {
          const command = cmd.includes(' ') ? `"${cmd}"` : cmd;
          await execAsync(`${command} --version`, { timeout: 5000 });
          // LibreOffice found - no console output
          this.libreOfficeAvailable = true;
          return true;
        } catch (err) {
          continue;
        }
      }

      this.libreOfficeAvailable = false;
      // Don't log paths on startup - only when conversion fails
      return false;
    } catch (error) {
      this.libreOfficeAvailable = false;
      return false;
    }
  }

  async add(job: ConversionJob): Promise<void> {
    // Check LibreOffice availability first
    const isAvailable = await this.checkLibreOffice();
    if (!isAvailable) {
      await storage.updateConversionStatus(
        job.conversionId,
        'failed',
        undefined,
        'LibreOffice is not installed. Please install LibreOffice from https://www.libreoffice.org/download/ and restart the server.'
      );
      return;
    }

    // Process asynchronously without blocking
    this.processJob(job).catch(error => {
      console.error('Unhandled conversion error:', error);
    });
  }

  private async processJob(job: ConversionJob): Promise<void> {
    const { conversionId, inputPath, outputPath, conversionType = 'to-pdf', targetFormat } = job;

    if (this.processing.has(conversionId)) {
      console.log(`Conversion ${conversionId} already processing`);
      return;
    }

    this.processing.add(conversionId);

    try {
      // Update status to processing
      await storage.updateConversionStatus(conversionId, 'processing');

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      let conversionSuccess = false;

      // Handle PDF to Office conversion
      if (conversionType === 'from-pdf') {
        conversionSuccess = await this.convertPdfToOffice(inputPath, outputPath, targetFormat || 'word');
      } else {
        // Handle Office to PDF conversion (existing logic)
        conversionSuccess = await this.convertOfficeToPdf(inputPath, outputPath, outputDir);
      }

      if (!conversionSuccess) {
        let errorMessage = 'Conversion failed';
        
        // Provide more specific error messages based on conversion type
        if (conversionType === 'from-pdf') {
          if (targetFormat === 'word') {
            errorMessage = 'PDF to Word conversion failed. Please ensure Python and pdf2docx are installed.';
          } else if (targetFormat === 'excel') {
            errorMessage = 'PDF to Excel conversion failed. Please ensure Python, tabula-py, and Java are installed.';
          } else if (targetFormat === 'ppt') {
            errorMessage = 'PDF to PowerPoint conversion failed. Please ensure Python, Poppler, and required packages are installed.';
          }
        } else {
          errorMessage = 'Office to PDF conversion failed. Please ensure LibreOffice is installed.';
        }
        
        throw new Error(errorMessage);
      }

      // Upload to R2 if configured
      let r2Key: string | undefined;
      let r2Url: string | undefined;
      let storageType = 'local';

      if (isR2Available()) {
        try {
          const outputFileName = path.basename(outputPath);
          const r2FilePath = `conversions/${conversionId}/${outputFileName}`;
          const contentType = getContentType(outputFileName);
          
          const uploadResult = await uploadToR2(outputPath, r2FilePath, contentType);
          r2Key = uploadResult.key;
          r2Url = uploadResult.url;
          storageType = 'r2';
          
          console.log(`✓ Uploaded to R2: ${r2Key}`);
        } catch (error) {
          console.error('Failed to upload to R2, falling back to local storage:', error);
          // Continue with local storage if R2 upload fails
        }
      }

      // Update conversion status to completed
      await storage.updateConversionStatus(
        conversionId,
        'completed',
        path.basename(outputPath),
        undefined,
        r2Key,
        r2Url,
        storageType
      );

      // Clean up input file
      try {
        await fs.unlink(inputPath);
      } catch (error) {
        console.error(`Failed to delete input file: ${error}`);
      }

      console.log(`Conversion ${conversionId} completed successfully`);
    } catch (error) {
      console.error(`Conversion ${conversionId} failed:`, error);
      
      // Update status to failed
      await storage.updateConversionStatus(
        conversionId,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Conversion failed'
      );

      // Clean up files
      try {
        await fs.unlink(inputPath);
      } catch {}
      try {
        await fs.unlink(outputPath);
      } catch {}
    } finally {
      this.processing.delete(conversionId);
    }
  }

  private async convertPdfToOffice(inputPath: string, outputPath: string, targetFormat: string): Promise<boolean> {
    try {
      const pythonScript = path.join(process.cwd(), 'server', 'pdf_converter.py');
      
      // Check if Python script exists
      try {
        await fs.access(pythonScript);
      } catch {
        console.error('❌ Python converter script not found:', pythonScript);
        return false;
      }

      // Check if Python is available
      try {
        await execAsync('python --version', { timeout: 5000 });
      } catch {
        console.error('❌ Python is not installed or not in PATH');
        console.error('👉 Please install Python from https://www.python.org/downloads/');
        console.error('👉 Or see WINDOWS_SETUP.md for detailed setup instructions');
        return false;
      }

      // Check if input file exists
      try {
        await fs.access(inputPath);
      } catch {
        console.error('❌ Input PDF file not found:', inputPath);
        return false;
      }

      // Execute Python conversion script
      const command = `python "${pythonScript}" "${inputPath}" "${outputPath}" ${targetFormat}`;
      console.log(`Executing PDF conversion: ${command}`);
      console.log(`Input file: ${inputPath}`);
      console.log(`Output file: ${outputPath}`);
      console.log(`Target format: ${targetFormat}`);
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: 180000, // 3 minute timeout
      });

      if (stdout) {
        console.log(`✓ Python stdout: ${stdout}`);
      }

      if (stderr && !stderr.includes('Warning')) {
        console.error(`❌ Python stderr: ${stderr}`);
        
        // Provide helpful error messages based on error content
        if (stderr.includes('poppler') || stderr.includes('Unable to get page count')) {
          console.error('');
          console.error('❌ POPPLER NOT INSTALLED');
          console.error('👉 PDF to PowerPoint conversion requires Poppler');
          console.error('👉 Install using: choco install poppler');
          console.error('👉 Or see WINDOWS_SETUP.md for manual installation');
          console.error('');
        } else if (stderr.includes('No module named')) {
          console.error('');
          console.error('❌ MISSING PYTHON DEPENDENCIES');
          console.error('👉 Install dependencies: pip install -r server/requirements.txt');
          console.error('👉 See WINDOWS_SETUP.md for complete setup guide');
          console.error('');
        } else if (stderr.includes('Java')) {
          console.error('');
          console.error('❌ JAVA NOT INSTALLED');
          console.error('👉 PDF to Excel conversion requires Java');
          console.error('👉 Install Java JDK from https://www.oracle.com/java/technologies/downloads/');
          console.error('');
        }
      }

      // Check if output file was created
      try {
        await fs.access(outputPath);
        const stats = await fs.stat(outputPath);
        console.log(`✓ Output file created: ${outputPath} (${stats.size} bytes)`);
        return true;
      } catch {
        console.error(`❌ Output file was not created: ${outputPath}`);
        console.error('   Conversion may have failed silently - check Python dependencies');
        return false;
      }
    } catch (error: any) {
      console.error('❌ PDF to Office conversion error:', error);
      console.error('   Error message:', error.message);
      
      // Enhanced error logging
      if (error.stderr) {
        console.error('   Error details (stderr):', error.stderr);
      }
      if (error.stdout) {
        console.error('   Output (stdout):', error.stdout);
      }
      if (error.code) {
        console.error('   Exit code:', error.code);
      }
      
      return false;
    }
  }

  private async convertOfficeToPdf(inputPath: string, outputPath: string, outputDir: string): Promise<boolean> {
    const libreOfficePaths = [
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
      'soffice',
    ];

    let lastError: Error | null = null;

    for (const libreOfficeCmd of libreOfficePaths) {
      try {
        // Convert using LibreOffice (headless mode)
        const command = libreOfficeCmd.includes(' ')
          ? `"${libreOfficeCmd}" --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`
          : `${libreOfficeCmd} --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
        
        console.log(`Attempting Office to PDF conversion...`);
        const { stdout, stderr } = await execAsync(command, {
          timeout: 120000, // 2 minute timeout
        });

        if (stderr && !stderr.includes('Warning')) {
          console.error(`Conversion warning: ${stderr}`);
        }
        if (stdout) {
          console.log(`Conversion output: ${stdout}`);
        }

        // LibreOffice creates the PDF with the same base name
        const inputBaseName = path.basename(inputPath, path.extname(inputPath));
        const generatedPdfPath = path.join(outputDir, `${inputBaseName}.pdf`);

        // Check if the file was created
        try {
          await fs.access(generatedPdfPath);
        } catch {
          throw new Error('PDF file was not generated');
        }

        // Rename to expected output name if different
        if (generatedPdfPath !== outputPath) {
          await fs.rename(generatedPdfPath, outputPath);
        }

        return true; // Success
      } catch (error) {
        lastError = error as Error;
        // Continue to try next path (don't log each failed attempt)
        continue;
      }
    }

    // All LibreOffice paths failed
    if (lastError) {
      console.error('');
      console.error('❌ LIBREOFFICE NOT INSTALLED');
      console.error('👉 Office to PDF conversion requires LibreOffice');
      console.error('👉 Download from: https://www.libreoffice.org/download/');
      console.error('👉 After installing, restart the development server');
      console.error('');
      throw new Error('LibreOffice is not installed. Please install LibreOffice from https://www.libreoffice.org/download/ and restart the server.');
    }
    return false;
  }
}

export const conversionQueue = new ConversionQueue();

console.log('Conversion queue initialized');
