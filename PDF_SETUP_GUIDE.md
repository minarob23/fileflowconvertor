# PDF Converter Setup Guide

Your FileFlowConvertor application now supports **bidirectional conversion**:
- **Office to PDF**: Convert .docx, .xlsx, .pptx files to PDF
- **PDF to Office**: Convert PDF files back to Word, Excel, or PowerPoint

## Prerequisites

### 1. Python Installation
Make sure Python 3.8+ is installed:
```bash
python --version
```

If not installed, download from: https://www.python.org/downloads/

### 2. Install Python Dependencies
Navigate to your project directory and install the required Python packages:

```bash
pip install -r server/requirements.txt
```

Or install individually:
```bash
pip install pdf2docx tabula-py openpyxl python-pptx pdf2image Pillow
```

### 3. Additional Requirements for PDF to PowerPoint Conversion

**For Windows:**
1. Download and install Poppler for Windows from:
   - https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract the files and add the `bin` folder to your system PATH

**For Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install poppler-utils

# macOS
brew install poppler
```

### 4. Java Installation (for PDF to Excel)
Tabula-py requires Java for extracting tables from PDFs:

**Windows:**
- Download Java from: https://www.java.com/download/
- Install and ensure `java` is in your PATH

**Linux:**
```bash
sudo apt-get install default-jre
```

**macOS:**
```bash
brew install openjdk
```

Verify Java installation:
```bash
java -version
```

## How It Works

### Supported Conversions

#### Office to PDF
- **Word (.docx) → PDF**: Uses LibreOffice
- **Excel (.xlsx) → PDF**: Uses LibreOffice
- **PowerPoint (.pptx) → PDF**: Uses LibreOffice

#### PDF to Office
- **PDF → Word (.docx)**: Preserves text formatting and layout
- **PDF → Excel (.xlsx)**: Extracts tables from PDF pages
- **PDF → PowerPoint (.pptx)**: Converts each page to a slide with images

### Usage

1. **Upload a file**: Drag and drop or browse for your file (.docx, .xlsx, .pptx, or .pdf)
2. **Choose conversion format**: Select the target format
   - For Office files: Only PDF option available
   - For PDF files: Choose Word, Excel, or PowerPoint
3. **Start conversion**: Click "Start Conversion" button
4. **Download**: Once completed, download your converted file

## Troubleshooting

### PDF to Office Conversion Issues

**Error: "Python is not available"**
- Make sure Python is installed and in your system PATH
- Test with: `python --version`

**Error: "No tables found in PDF" (Excel conversion)**
- The PDF might not contain extractable tables
- Try using Word format instead

**Error: "Poppler not found" (PowerPoint conversion)**
- Install Poppler utilities (see Prerequisites above)
- Ensure Poppler's `bin` folder is in your PATH

**Error: "Java not found" (Excel conversion)**
- Install Java Runtime Environment (JRE)
- Verify with: `java -version`

### Office to PDF Conversion Issues

**Error: "LibreOffice not found"**
- Install LibreOffice from: https://www.libreoffice.org/download/
- Restart your server after installation

## File Size Limits
- Maximum file size: **50MB**
- Recommended for best performance: Under 10MB

## Supported File Types
- **Input**: .docx, .xlsx, .pptx, .pdf
- **Output**: .pdf, .docx, .xlsx, .pptx

## Performance Tips
- **PDF to PowerPoint**: Processing time depends on number of pages (expect ~2-3 seconds per page)
- **PDF to Excel**: Best results with PDFs containing clear table structures
- **PDF to Word**: Works best with text-heavy PDFs

## Security Notes
- Files are automatically deleted after conversion
- All conversions are processed server-side
- No files are permanently stored (unless R2 storage is configured)
