#!/bin/bash
# Railway startup verification script

echo "🔍 Verifying dependencies..."
echo ""

# Check LibreOffice
echo "📄 Checking LibreOffice..."
if command -v soffice &> /dev/null; then
    VERSION=$(soffice --version)
    echo "✅ LibreOffice found: $VERSION"
else
    echo "❌ LibreOffice NOT found"
fi
echo ""

# Check Python
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version)
    echo "✅ Python found: $VERSION"
    
    # Check Python packages
    echo "📦 Checking Python packages..."
    python3 -c "import pdf2docx; print('✅ pdf2docx installed')" 2>/dev/null || echo "❌ pdf2docx NOT installed"
    python3 -c "import tabula; print('✅ tabula-py installed')" 2>/dev/null || echo "❌ tabula-py NOT installed"
    python3 -c "import openpyxl; print('✅ openpyxl installed')" 2>/dev/null || echo "❌ openpyxl NOT installed"
    python3 -c "import pptx; print('✅ python-pptx installed')" 2>/dev/null || echo "❌ python-pptx NOT installed"
    python3 -c "import pdf2image; print('✅ pdf2image installed')" 2>/dev/null || echo "❌ pdf2image NOT installed"
    python3 -c "import PIL; print('✅ Pillow installed')" 2>/dev/null || echo "❌ Pillow NOT installed"
else
    echo "❌ Python NOT found"
fi
echo ""

# Check Poppler
echo "📊 Checking Poppler..."
if command -v pdftoppm &> /dev/null; then
    echo "✅ Poppler found"
else
    echo "❌ Poppler NOT found"
fi
echo ""

# Check Java
echo "☕ Checking Java..."
if command -v java &> /dev/null; then
    VERSION=$(java -version 2>&1 | head -n 1)
    echo "✅ Java found: $VERSION"
else
    echo "❌ Java NOT found (optional - only needed for PDF to Excel)"
fi
echo ""

echo "🚀 Starting application..."
echo ""

# Start the application
npm run start
