# Quick Poppler Installation Guide for Windows

## What is Poppler?
Poppler is required for **PDF to PowerPoint conversion**. It converts PDF pages into images that can be inserted into PowerPoint slides.

## Manual Installation (5 minutes)

### Step 1: Download Poppler
1. Go to: **https://github.com/oschwartz10612/poppler-windows/releases/**
2. Download the latest **Release-XX.XX.X-0.zip** file (usually around 20MB)
3. Example: `Release-24.08.0-0.zip`

### Step 2: Extract the Files
1. Create a folder: `C:\Program Files\poppler`
2. Extract the downloaded ZIP file to this folder
3. You should now have: `C:\Program Files\poppler\Library\bin\pdftoppm.exe`

### Step 3: Add to System PATH
1. Press `Windows + R` to open Run dialog
2. Type: `sysdm.cpl` and press Enter
3. Click **"Advanced"** tab
4. Click **"Environment Variables"** button
5. Under **"System variables"**, find and select **"Path"**
6. Click **"Edit..."**
7. Click **"New"**
8. Add: `C:\Program Files\poppler\Library\bin`
9. Click **"OK"** on all dialogs

### Step 4: Verify Installation
1. **Close and reopen** your PowerShell/Command Prompt
2. Run this command:
   ```powershell
   pdftoppm -h
   ```
3. You should see Poppler help text (not an error)

### Step 5: Restart Your Application
1. **Close VS Code completely**
2. Reopen VS Code
3. Navigate to your project folder
4. Start the development server:
   ```powershell
   npm run dev
   ```

## Test PDF to PowerPoint Conversion
1. Upload a PDF file
2. Select **PowerPoint** as the conversion format
3. Click "Start Conversion"
4. The conversion should now work! 🎉

## Troubleshooting

### "pdftoppm is not recognized..."
- Make sure you added `C:\Program Files\poppler\Library\bin` to PATH (not just `C:\Program Files\poppler`)
- Restart your terminal/VS Code after adding to PATH

### "Access denied" when creating folder
- Create the folder in a different location, e.g., `C:\poppler`
- Then add `C:\poppler\Library\bin` to PATH instead

### Still not working?
- Verify the path exists: Check that `C:\Program Files\poppler\Library\bin\pdftoppm.exe` file exists
- Try using the full path in terminal: `"C:\Program Files\poppler\Library\bin\pdftoppm.exe" -h`

## What Works Without Poppler?

Even without Poppler, these conversions work:
- ✅ Office files (Word, Excel, PowerPoint) → PDF
- ✅ PDF → Word (.docx)
- ✅ PDF → Excel (.xlsx) - requires Java

Only **PDF → PowerPoint** requires Poppler.

## Need Help?
See the complete setup guide: [WINDOWS_SETUP.md](./WINDOWS_SETUP.md)
