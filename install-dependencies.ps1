# PowerShell script to install PDF conversion dependencies on Windows
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FileFlowConvertor - Dependency Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script should be run as Administrator for best results" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# 1. Check Python
Write-Host "1️⃣  Checking Python..." -ForegroundColor Cyan
if (Test-Command "python") {
    $pythonVersion = python --version
    Write-Host "   ✅ $pythonVersion installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Python not found" -ForegroundColor Red
    Write-Host "   👉 Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "   👉 During installation, check 'Add Python to PATH'" -ForegroundColor Yellow
    exit 1
}

# 2. Install Python Dependencies
Write-Host ""
Write-Host "2️⃣  Installing Python dependencies..." -ForegroundColor Cyan
try {
    Set-Location -Path "$PSScriptRoot\server"
    pip install -r requirements.txt
    Write-Host "   ✅ Python packages installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install Python packages" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# 3. Check Chocolatey
Write-Host ""
Write-Host "3️⃣  Checking Chocolatey..." -ForegroundColor Cyan
if (Test-Command "choco") {
    Write-Host "   ✅ Chocolatey is installed" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Chocolatey not found. Installing Chocolatey..." -ForegroundColor Yellow
    
    if ($isAdmin) {
        try {
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            Write-Host "   ✅ Chocolatey installed successfully" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️  Failed to install Chocolatey" -ForegroundColor Yellow
            Write-Host "   You can install Poppler manually (see WINDOWS_SETUP.md)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Run as Administrator to install Chocolatey" -ForegroundColor Yellow
    }
}

# 4. Install Poppler
Write-Host ""
Write-Host "4️⃣  Checking Poppler..." -ForegroundColor Cyan
if (Test-Command "pdftoppm") {
    Write-Host "   ✅ Poppler is installed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Poppler not found" -ForegroundColor Red
    
    if (Test-Command "choco") {
        Write-Host "   ℹ️  Installing Poppler via Chocolatey..." -ForegroundColor Yellow
        
        if ($isAdmin) {
            try {
                choco install poppler -y
                Write-Host "   ✅ Poppler installed successfully" -ForegroundColor Green
                Write-Host "   ⚠️  Please restart your terminal/VS Code" -ForegroundColor Yellow
            } catch {
                Write-Host "   ❌ Failed to install Poppler" -ForegroundColor Red
            }
        } else {
            Write-Host "   ⚠️  Run as Administrator to install Poppler" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   👉 Install manually from: https://github.com/oschwartz10612/poppler-windows/releases/" -ForegroundColor Yellow
        Write-Host "   👉 See WINDOWS_SETUP.md for instructions" -ForegroundColor Yellow
    }
}

# 5. Check Java (optional, for Excel conversion)
Write-Host ""
Write-Host "5️⃣  Checking Java (optional for Excel conversion)..." -ForegroundColor Cyan
if (Test-Command "java") {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ $javaVersion installed" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Java not found (optional)" -ForegroundColor Yellow
    Write-Host "   PDF to Excel conversion requires Java" -ForegroundColor Yellow
    Write-Host "   👉 Download from: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$pythonOk = Test-Command "python"
$popplerOk = Test-Command "pdftoppm"
$javaOk = Test-Command "java"

Write-Host "Python:   $(if ($pythonOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($pythonOk) { 'Green' } else { 'Red' })
Write-Host "Poppler:  $(if ($popplerOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($popplerOk) { 'Green' } else { 'Red' })
Write-Host "Java:     $(if ($javaOk) { '✅' } else { 'ℹ️ (optional)' })" -ForegroundColor $(if ($javaOk) { 'Green' } else { 'Yellow' })

Write-Host ""
Write-Host "Supported conversions:" -ForegroundColor Cyan
Write-Host "  • Office → PDF: $(if ($pythonOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($pythonOk) { 'Green' } else { 'Red' })
Write-Host "  • PDF → Word:   $(if ($pythonOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($pythonOk) { 'Green' } else { 'Red' })
Write-Host "  • PDF → Excel:  $(if ($pythonOk -and $javaOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($pythonOk -and $javaOk) { 'Green' } else { 'Red' })
Write-Host "  • PDF → PPT:    $(if ($pythonOk -and $popplerOk) { '✅' } else { '❌' })" -ForegroundColor $(if ($pythonOk -and $popplerOk) { 'Green' } else { 'Red' })

Write-Host ""

if ($popplerOk -and $pythonOk) {
    Write-Host "🎉 All required dependencies are installed!" -ForegroundColor Green
    Write-Host "You can now convert PDFs to Word, Excel, and PowerPoint!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some dependencies are missing" -ForegroundColor Yellow
    Write-Host "Please install missing dependencies and restart your terminal" -ForegroundColor Yellow
    Write-Host "See WINDOWS_SETUP.md for detailed instructions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
