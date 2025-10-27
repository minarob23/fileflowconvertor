# DocToPDF - Document to PDF Converter

## Overview

DocToPDF is a full-stack web application that allows users to upload office documents (.docx, .xlsx, .pptx) and convert them to high-quality PDF files. The application features user authentication, drag-and-drop file uploads, real-time conversion tracking, and a complete history dashboard.

## Current Status

**Version**: MVP 1.0
**Last Updated**: 2025-10-22

### Implemented Features

✅ **User Authentication**
- Replit Auth integration with email/password and social login (Google, GitHub, X, Apple)
- Secure session management with PostgreSQL storage
- Protected routes and API endpoints

✅ **File Upload & Conversion**
- Drag-and-drop interface with browse option
- Support for .docx, .xlsx, and .pptx files
- Maximum file size: 50MB
- File type validation with clear error messages
- Async conversion processing using LibreOffice CLI

✅ **Conversion Dashboard**
- Real-time statistics (total conversions, completed, today's count)
- Conversion history with status tracking (pending, processing, completed, failed)
- Auto-refresh for active conversions
- Download completed PDFs
- Beautiful empty states and loading indicators

✅ **UI/UX**
- Responsive design with Tailwind CSS
- Dark mode support with theme toggle
- Professional blue color palette
- Smooth animations and transitions
- Document type icons and status badges

## Technology Stack

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query v5 for data fetching
- Tailwind CSS + shadcn/ui components
- Lucide React icons

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL (Neon) database
- Drizzle ORM
- Passport.js with OpenID Connect (Replit Auth)
- Multer for file uploads
- LibreOffice (headless) for document conversion

### Database Schema

**users** - User accounts from Replit Auth
- id (varchar, primary key)
- email (varchar, unique)
- firstName, lastName (varchar)
- profileImageUrl (varchar)
- createdAt, updatedAt (timestamp)

**sessions** - Session storage for authentication
- sid (varchar, primary key)
- sess (jsonb)
- expire (timestamp)

**conversions** - Document conversion records
- id (varchar, primary key)
- userId (varchar, foreign key → users.id)
- originalFileName (varchar)
- convertedFileName (varchar)
- fileSize (integer, bytes)
- status (varchar: pending, processing, completed, failed)
- errorMessage (varchar, nullable)
- createdAt, updatedAt (timestamp)

## Architecture

### File Upload Flow
1. User uploads file via drag-and-drop or browse
2. Multer middleware validates file type and size
3. File saved to `/uploads` directory
4. Conversion record created in database with "pending" status
5. Job added to in-memory conversion queue
6. Queue processes conversion asynchronously:
   - Updates status to "processing"
   - Runs LibreOffice CLI command
   - Saves PDF to `/converted` directory
   - Updates status to "completed" or "failed"
   - Cleans up original file
7. Frontend polls for status updates every 3 seconds
8. User can download completed PDF

### Authentication Flow
1. User clicks "Sign In" button
2. Redirects to `/api/login` (Replit Auth OIDC)
3. User authenticates with Replit
4. Callback to `/api/callback` with tokens
5. Session created and user data upserted to database
6. Redirects to dashboard
7. Frontend uses `useAuth` hook to check authentication status
8. Protected routes require valid session

## API Endpoints

### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout and end session
- `GET /api/callback` - OIDC callback handler
- `GET /api/auth/user` - Get current user info (protected)

### Conversions
- `POST /api/conversions/upload` - Upload and convert document (protected)
- `GET /api/conversions` - Get user's conversion history (protected)
- `GET /api/conversions/stats` - Get conversion statistics (protected)
- `GET /api/conversions/:id/download` - Download converted PDF (protected)

## Environment Variables

Required environment variables (automatically provided by Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit application ID
- `REPLIT_DOMAINS` - Comma-separated list of domains
- `ISSUER_URL` (optional) - OIDC issuer URL

## File Storage

- **Uploads**: `./uploads/` - Temporary storage for uploaded files
- **Converted**: `./converted/` - Storage for converted PDF files
- Files are automatically cleaned up after successful conversion
- Failed conversions also trigger cleanup

## User Preferences

- Users prefer a clean, modern interface with minimal friction
- Dark mode support is essential
- Real-time feedback for file operations is critical
- Clear error messages for failed conversions

## Recent Changes

### 2025-10-22 - Initial MVP Release
- Implemented complete user authentication with Replit Auth
- Built responsive landing page with hero section
- Created dashboard with file upload and conversion history
- Integrated LibreOffice for document-to-PDF conversion
- Added real-time status tracking and auto-refresh
- Implemented dark mode support
- Set up PostgreSQL database with Drizzle ORM

## Known Limitations & Future Enhancements

### Next Phase Features
- Cloud storage integration (AWS S3 or Google Cloud Storage)
- Batch processing for multiple files
- File preview before conversion
- Rate limiting per user
- File virus scanning
- Email notifications for completed conversions
- User analytics dashboard
- Premium subscription plans
- Conversion quality settings

### Current Limitations
- Local file storage (not scalable for production)
- No file preview capability
- No batch upload support
- No rate limiting implemented
- Maximum 50MB file size limit

## Development

### Running the Application
```bash
npm run dev
```

This starts both the Express backend and Vite frontend development server on port 5000.

### Database Migrations
```bash
npm run db:push
```

Push schema changes to the database using Drizzle Kit.

## Security Considerations

- All routes are protected with authentication middleware
- Files are validated for type and size before processing
- User can only download their own converted files
- Sessions are stored securely in PostgreSQL
- HTTPS enforced in production (Replit provides SSL)
- SQL injection prevented via Drizzle ORM parameterized queries

## Support & Contact

For issues or questions about this application, please contact the development team or create an issue in the project repository.
