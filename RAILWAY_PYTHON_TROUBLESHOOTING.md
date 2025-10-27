# Railway Troubleshooting Guide - Python Dependencies

## 🔴 Problem: Python Conversions Failing

### Error Messages:
- "PDF to Word conversion failed. Please ensure Python and pdf2docx are installed."
- "PDF to PowerPoint conversion failed. Please ensure Python, Poppler, and required packages are installed."
- "PDF to Excel conversion failed. Please ensure Python, tabula-py, and Java are installed."

## ✅ Solutions

### Option 1: Force Rebuild with Nixpacks (Recommended)

1. **Verify Configuration Files**
   - Ensure `nixpacks.toml` exists in your repository
   - Ensure `server/requirements.txt` exists with all packages

2. **Force Redeploy**
   ```bash
   # Make a small change to trigger rebuild
   git commit --allow-empty -m "Force Railway rebuild"
   git push
   ```

3. **Check Railway Logs**
   Look for these lines:
   ```
   ✅ LibreOffice found
   ✅ Python found: Python 3.11.x
   ✅ pdf2docx installed
   ✅ tabula-py installed
   ✅ openpyxl installed
   ✅ python-pptx installed
   ✅ pdf2image installed
   ✅ Pillow installed
   ✅ Poppler found
   ✅ Java found
   ```

### Option 2: Switch to Docker Build

If Nixpacks isn't working:

1. **Go to Railway Settings**
   - Project → Settings → Build
   - Change build method to "Docker"

2. **Redeploy**
   - Railway will now use `Dockerfile` instead
   - Docker explicitly installs all dependencies

3. **Verify in Logs**
   ```
   🔍 Verifying dependencies...
   ✅ All packages installed
   ```

### Option 3: Manual Dependency Installation

Add this to `nixpacks.toml`:

```toml
[phases.install]
cmds = [
  "npm install",
  "python3 -m pip install --upgrade pip",
  "python3 -m pip install pdf2docx==0.5.8",
  "python3 -m pip install tabula-py==2.9.0",
  "python3 -m pip install openpyxl==3.1.2",
  "python3 -m pip install python-pptx==0.6.23",
  "python3 -m pip install pdf2image==1.17.0",
  "python3 -m pip install Pillow==10.3.0"
]
```

## 🧪 Testing After Deployment

### 1. Check Health Endpoint

Visit: `https://your-app.railway.app/api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "dependencies": {
    "libreoffice": true,
    "python": true,
    "pythonPackages": true,
    "poppler": true,
    "java": true,
    "r2Storage": true
  },
  "platform": "linux"
}
```

**If `pythonPackages: false`:**
- Python dependencies didn't install
- Check Railway build logs
- Try Docker build method

### 2. Check Railway Logs

**Good logs should show:**
```
📄 Checking LibreOffice...
✅ LibreOffice found: LibreOffice 7.x.x

🐍 Checking Python...
✅ Python found: Python 3.11.x

📦 Checking Python packages...
✅ pdf2docx installed
✅ tabula-py installed
✅ openpyxl installed
✅ python-pptx installed
✅ pdf2image installed
✅ Pillow installed

📊 Checking Poppler...
✅ Poppler found

☕ Checking Java...
✅ Java found

🚀 Starting application...
```

**Bad logs show:**
```
❌ Python NOT found
❌ pdf2docx NOT installed
```

### 3. Test Each Conversion Type

**PDF → Word:**
```
Upload a PDF file
Select "Convert to Word"
Should create .docx file
```

**PDF → PowerPoint:**
```
Upload a PDF file
Select "Convert to PowerPoint"
Should create .pptx file
```

**PDF → Excel:**
```
Upload a PDF with tables
Select "Convert to Excel"
Should create .xlsx file with extracted tables
```

## 🔍 Common Issues & Fixes

### Issue 1: "python3: command not found"

**Cause:** Python not installed in Nixpacks

**Fix:**
```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ["...", "python311", "python311Packages.pip"]
```

### Issue 2: "No module named 'pdf2docx'"

**Cause:** Python packages not installed

**Fix 1 - Check requirements.txt:**
```bash
# Ensure this file exists
cat server/requirements.txt
```

**Fix 2 - Manual installation in nixpacks.toml:**
```toml
[phases.install]
cmds = [
  "npm install",
  "python3 -m pip install --upgrade pip",
  "python3 -m pip install -r server/requirements.txt"
]
```

**Fix 3 - Switch to Docker:**
- Railway Settings → Build → Docker
- Dockerfile handles everything

### Issue 3: "Unable to get page count" (Poppler)

**Cause:** Poppler not installed

**Fix:**
```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ["...", "poppler_utils"]
```

Or in Dockerfile:
```dockerfile
RUN apt-get install -y poppler-utils
```

### Issue 4: Java not found (Excel conversion)

**Cause:** JDK not installed

**Fix:**
```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ["...", "jdk"]
```

Or in Dockerfile:
```dockerfile
RUN apt-get install -y default-jdk
```

### Issue 5: Build succeeds but packages still missing

**Cause:** Build cache issue

**Solution:**
1. Railway Dashboard → Settings → Clear Build Cache
2. Redeploy

Or:
```bash
git commit --allow-empty -m "Clear cache and rebuild"
git push
```

### Issue 6: Packages install but can't import

**Cause:** Python version mismatch

**Solution:**
```toml
# Use python311 specifically
[phases.setup]
nixPkgs = ["...", "python311", "python311Packages.pip"]

[phases.install]
cmds = [
  "python3 -m pip install --upgrade pip",
  "python3 -m pip install -r server/requirements.txt"
]
```

## 📋 Complete Verification Checklist

After deploying, verify:

- [ ] Health endpoint shows all dependencies `true`
- [ ] Railway logs show "✅" for all packages
- [ ] Office → PDF conversion works
- [ ] PDF → Word conversion works
- [ ] PDF → PowerPoint conversion works
- [ ] PDF → Excel conversion works (if Java installed)
- [ ] No error messages in Railway logs

## 🛠️ Quick Fix Commands

### Redeploy with empty commit:
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Check build logs:
```
Railway Dashboard → Your Project → Deployments → Latest → Build Logs
```

### Check runtime logs:
```
Railway Dashboard → Your Project → Logs
```

### Test health endpoint:
```bash
curl https://your-app.railway.app/api/health
```

## 📞 Still Having Issues?

1. **Check files exist:**
   - `nixpacks.toml` ✅
   - `Dockerfile` ✅
   - `server/requirements.txt` ✅
   - `start.sh` ✅

2. **Try Docker build:**
   - Railway Settings → Build → Docker
   - More reliable than Nixpacks

3. **Check Railway logs carefully:**
   - Look for specific error messages
   - Search for "❌" in logs

4. **Verify environment variables:**
   - All required variables set in Railway?

5. **Test locally first:**
   ```bash
   docker build -t fileflow .
   docker run -p 5000:5000 fileflow
   ```

## 🎯 Final Checklist for Railway

**Required Configuration:**
- ✅ `nixpacks.toml` with python311, libreoffice, poppler_utils, jdk
- ✅ `Dockerfile` as fallback
- ✅ `server/requirements.txt` with all Python packages
- ✅ `start.sh` verification script
- ✅ All environment variables set in Railway

**After Deploy:**
- ✅ Check `/api/health` endpoint
- ✅ Verify Railway logs show all packages installed
- ✅ Test all 4 conversion types
- ✅ No errors in logs

**If still failing:**
- Switch to Docker build method
- Clear Railway build cache
- Check Railway community/support
