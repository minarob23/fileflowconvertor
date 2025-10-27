# Windows Setup Guide for PDF Conversion

This guide will help you set up all the required dependencies for PDF conversion on Windows.

## Required Software

### 1. Python (if not already installed)
- Download from: https://www.python.org/downloads/
- During installation, **check "Add Python to PATH"**
- Verify: `python --version`

### 2. Poppler (Required for PDF to PowerPoint conversion)

Poppler is a PDF rendering library needed to convert PDF pages to images.

#### Installation Steps:

**Option A: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Poppler
choco install poppler
```

**Option B: Manual Installation**
1. Download Poppler for Windows:
   - Go to: https://github.com/oschwartz10612/poppler-windows/releases/
   - Download the latest `Release-XX.XX.X-0.zip`

2. Extract the ZIP file to a permanent location:
   - Example: `C:\Program Files\poppler`

3. Add to PATH:
   - Open "Environment Variables" (Search in Start Menu)
   - Under "System Variables", find and edit "Path"
   - Click "New" and add: `C:\Program Files\poppler\Library\bin`
   - Click "OK" on all dialogs

4. Verify installation:
   ```powershell
   # Restart your terminal, then run:
   pdftoppm -h
   ```

### 3. Install Python Dependencies

Run in the project root directory:

```powershell
cd server
pip install -r requirements.txt
```

### 4. Verify Installation

Test if everything is working:

```powershell
# Test Python
python --version

# Test Poppler
pdftoppm -h

# Test Python packages
python -c "import pdf2docx, tabula, openpyxl, pdf2image, pptx; print('All packages installed!')"
```

## Common Issues

### Issue: "python: command not found"
**Solution**: Reinstall Python and ensure "Add to PATH" is checked during installation.

### Issue: "Unable to get page count. Is poppler installed and in PATH?"
**Solution**: 
1. Verify Poppler is installed: `pdftoppm -h`
2. If not found, follow the Poppler installation steps above
3. Restart your terminal/VS Code after adding to PATH

### Issue: "No module named 'pdf2docx'"
**Solution**: Install Python dependencies: `pip install -r server/requirements.txt`

### Issue: Java not found (for tabula-py/Excel conversion)
**Solution**: 
1. Download Java JDK: https://www.oracle.com/java/technologies/downloads/
2. Install and add to PATH
3. Verify: `java -version`

## Testing PDF Conversion

After setup, test the conversion:

```powershell
# Test Word conversion
python server/pdf_converter.py test.pdf output.docx word

# Test PowerPoint conversion (requires Poppler)
python server/pdf_converter.py test.pdf output.pptx ppt

# Test Excel conversion (requires Java)
python server/pdf_converter.py test.pdf output.xlsx excel
```

## Need Help?

If you encounter issues:
1. Restart your terminal/VS Code after installing dependencies
2. Check that all paths are correctly added to system PATH
3. Verify each dependency individually using the verification commands above
