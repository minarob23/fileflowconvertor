# FileFlowConvertor

A full-stack web application for converting documents between PDF and Office formats (Word, Excel, PowerPoint) with user authentication, cloud storage, and real-time conversion tracking.

## Features

### 🔄 Bidirectional Conversion
- **Office to PDF**: Convert Word (.docx), Excel (.xlsx), and PowerPoint (.pptx) to PDF
- **PDF to Office**: Convert PDF files back to editable Word, Excel, or PowerPoint formats

### 🚀 Key Capabilities
- Drag-and-drop file uploads
- Real-time conversion status tracking
- Conversion history dashboard
- User authentication (Email/Password & Google OAuth)
- Cloud storage with Cloudflare R2
- Subscription plans with usage limits
- Responsive design with dark mode support

### 📊 Dashboard Features
- View all conversion history
- Track conversion statistics
- Download converted files
- Monitor usage against plan limits

## Tech Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS + shadcn/ui components
- Vite for build tooling

### Backend
- Node.js with Express
- TypeScript
- LibreOffice for Office to PDF conversion
- Python scripts for PDF to Office conversion
- Passport.js for authentication
- Cloudflare R2 for file storage
- SQLite database (Drizzle ORM)

### Conversion Tools
- **LibreOffice**: Office → PDF conversion
- **pdf2docx**: PDF → Word conversion
- **tabula-py**: PDF → Excel conversion (table extraction)
- **pdf2image + python-pptx**: PDF → PowerPoint conversion

## Prerequisites

1. **Node.js** (v18+)
2. **Python** (v3.8+)
3. **LibreOffice** - For Office to PDF conversion
4. **Poppler** - For PDF to PowerPoint conversion
5. **Java** (optional) - For PDF to Excel table extraction

## Quick Start (Windows)

### Automated Installation
Run the PowerShell installation script (as Administrator):
```powershell
.\install-dependencies.ps1
```

This will automatically:
- Check Python installation
- Install Python dependencies
- Install Chocolatey (if needed)
- Install Poppler via Chocolatey
- Check Java installation (optional)

### Manual Installation
See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for detailed manual installation instructions.

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/minarob23/fileflowconvertor.git
cd fileflowconvertor
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Install Python dependencies
```bash
pip install -r server/requirements.txt
```

Or install individually:
```bash
pip install pdf2docx tabula-py openpyxl python-pptx pdf2image Pillow
```

### 4. Install System Dependencies

**LibreOffice** (for Office → PDF):
- Windows: Download from https://www.libreoffice.org/download/
- Linux: `sudo apt-get install libreoffice`
- macOS: `brew install libreoffice`

**Poppler** (for PDF → PowerPoint):
- Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/
- Linux: `sudo apt-get install poppler-utils`
- macOS: `brew install poppler`

**Java** (for PDF → Excel):
- Download from https://www.java.com/download/
- Verify: `java -version`

### 5. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (optional - defaults to local SQLite)
DATABASE_URL=file:./database.db

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudflare R2 Storage (optional)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_public_url

# Stripe (optional - for subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

### Production Build
```bash
npm run build
npm start
```

## Usage

1. **Sign Up/Login**: Create an account or login with Google
2. **Upload File**: Drag and drop or browse for your file
   - Supported: .docx, .xlsx, .pptx, .pdf (max 50MB)
3. **Choose Format**: Select target conversion format
   - For Office files → PDF only
   - For PDF files → Choose Word, Excel, or PowerPoint
4. **Convert**: Click "Start Conversion"
5. **Download**: Download your converted file from the dashboard

## Conversion Details

### Office → PDF
- Uses LibreOffice's headless mode
- Preserves formatting, images, and layouts
- Fast and reliable conversion

### PDF → Word (.docx)
- Extracts text with formatting
- Preserves document structure
- Best for text-heavy PDFs

### PDF → Excel (.xlsx)
- Extracts tables from PDF pages
- Each table becomes a separate sheet
- Requires Java Runtime

### PDF → PowerPoint (.pptx)
- Converts each PDF page to a slide
- Pages rendered as images
- Maintains visual layout

## Troubleshooting

### Common Issues

**"Unable to get page count. Is poppler installed and in PATH?"**
- PDF to PowerPoint conversion requires Poppler
- Run: `.\install-dependencies.ps1` (Windows)
- Or see [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for manual installation

**"No module named 'pdf2docx'"**
- Install Python dependencies: `pip install -r server/requirements.txt`

**"Python is not available"**
- Install Python from https://www.python.org/downloads/
- Ensure "Add Python to PATH" is checked during installation

**Conversion fails or times out**
- Check server logs for specific error messages
- Verify all dependencies are installed: run `.\install-dependencies.ps1`
- Restart your terminal/VS Code after installing new dependencies

For detailed troubleshooting, see [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)

## Project Structure

```
fileflowconvertor/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Backend Express application
│   ├── auth.ts          # Authentication logic
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   ├── conversionQueue.ts # Conversion processing
│   ├── pdf_converter.py  # Python PDF converter
│   └── r2Storage.ts     # Cloud storage integration
├── shared/              # Shared TypeScript types
└── uploads/             # Temporary file storage
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For issues and questions, please open an issue on GitHub.

