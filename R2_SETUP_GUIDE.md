# Cloudflare R2 Setup Guide

Your application now supports Cloudflare R2 cloud storage! Follow these steps to set it up.

## 🎯 Benefits of Using R2

- ✅ **10 GB free storage forever**
- ✅ **No egress fees** (unlimited downloads)
- ✅ **S3-compatible API**
- ✅ **Automatic backups**
- ✅ **Better scalability**

## 📋 Setup Steps

### Step 1: Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

### Step 2: Enable R2

1. Log in to Cloudflare Dashboard
2. Click **R2** in the left sidebar
3. Click **Purchase R2 Plan** → Select **Free** tier
4. Confirm the plan

### Step 3: Create R2 Bucket

1. In R2 Dashboard, click **Create bucket**
2. Enter bucket name: `fileflow-conversions` (or your preferred name)
3. Choose location: **Automatic** (recommended)
4. Click **Create bucket**

### Step 4: Create API Token

1. In R2 Dashboard, click **Manage R2 API Tokens**
2. Click **Create API Token**
3. Enter token name: `fileflow-api`
4. Permissions: **Object Read & Write**
5. Click **Create API Token**
6. **⚠️ IMPORTANT**: Copy and save these credentials (shown only once):
   - **Access Key ID**
   - **Secret Access Key**

### Step 5: Get Account ID

1. In Cloudflare Dashboard, look at the URL or sidebar
2. Your Account ID is visible in the URL or account settings
3. Or click your profile → **Account** → copy **Account ID**

### Step 6: Configure Your Application

Open your `.env` file and add:

```env
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=fileflow-conversions
R2_PUBLIC_URL=
```

**Note**: Leave `R2_PUBLIC_URL` empty for now (you can set up a custom domain later for public URLs)

### Step 7: Restart Your Server

```bash
npm run dev
```

You should see: `✓ Cloudflare R2 storage configured`

## ✅ Test It Out

1. Upload a document (.docx, .xlsx, .pptx)
2. Wait for conversion to complete
3. Check your R2 bucket - you'll see the converted PDF!
4. Download works automatically from R2

## 🔄 How It Works

### With R2 Enabled:
1. User uploads file → Saved locally temporarily
2. LibreOffice converts to PDF → Saved locally
3. **PDF automatically uploaded to R2**
4. User downloads → Served from R2 with presigned URL
5. Local files cleaned up

### Without R2 (Current Behavior):
1. User uploads file → Saved locally
2. LibreOffice converts to PDF → Saved locally
3. User downloads → Served from local storage
4. Files remain on server

## 🎛️ Optional: Public URL Setup

To enable direct public URLs (no presigned URLs):

1. In R2 Dashboard → your bucket → **Settings**
2. Click **Allow Public Access**
3. Get the public domain: `https://pub-xxxxx.r2.dev`
4. Add to `.env`:
   ```env
   R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
   ```

## 🔒 Security Notes

- ✅ API tokens are stored securely in `.env`
- ✅ `.env` is in `.gitignore` (never commit secrets!)
- ✅ Each user can only download their own files
- ✅ Presigned URLs expire after 1 hour
- ✅ Files are organized by conversion ID in R2

## 💰 Cost Breakdown (Free Tier)

| Feature | Free Tier | Your Usage (Est.) |
|---------|-----------|-------------------|
| Storage | 10 GB | ~2,000 PDFs |
| Class A Operations | 1M/month | ~10,000 uploads |
| Class B Operations | 10M/month | ~100,000 downloads |
| Egress | **FREE** | Unlimited! |

**Translation**: You can convert ~10,000 documents per month completely free! 🎉

## 🆘 Troubleshooting

### "R2 not configured, using local storage"
- Check all R2 environment variables are set in `.env`
- Restart the server after adding credentials

### "Failed to upload to R2"
- Verify API token has Read & Write permissions
- Check bucket name is correct
- Ensure account ID is correct

### Files not appearing in R2
- Check the R2 bucket in Cloudflare Dashboard
- Look under `conversions/{conversion-id}/` folder structure

## 📚 Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [AWS S3 SDK Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

**Ready to go cloud? Follow the steps above!** ☁️
