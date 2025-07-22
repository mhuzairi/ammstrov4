# AMMSTRO Website Deployment Guide

## 📋 **Overview**

This guide provides step-by-step instructions for deploying the AMMSTRO aviation maintenance website to GitHub Pages. The website features company information, interactive dashboard, and professional aviation imagery.

## 📦 **Package Contents**

The deployment package (`ammstro-github-corrected.zip`) contains:

- **React-based website** with modern UI components
- **Company information section** (Vision, Mission, Leadership Team)
- **Interactive AI dashboard** with chat functionality
- **Professional aviation images** (commercial, military, helicopter)
- **Responsive design** optimized for all devices
- **Complete source code** ready for GitHub deployment

---

## 🚀 **Deployment Methods**

### **Method 1: GitHub Pages (Recommended)**
### **Method 2: GitHub Actions (Advanced)**
### **Method 3: Manual Build Upload**

---

## 🎯 **Method 1: GitHub Pages Deployment**

### **Step 1: Prepare Repository**

1. **Create GitHub Repository**
   ```
   - Go to github.com
   - Click "New repository"
   - Name: ammstro-website (or your preferred name)
   - Set to Public (required for free GitHub Pages)
   - Click "Create repository"
   ```

2. **Extract and Upload Files**
   ```
   - Extract ammstro-github-corrected.zip
   - Upload all contents to your GitHub repository:
     ├── src/
     ├── assets/
     ├── package.json
     ├── vite.config.js
     ├── index.html
     ├── tailwind.config.js
     └── postcss.config.js
   ```

### **Step 2: Enable GitHub Pages**

1. **Navigate to Repository Settings**
   ```
   - Go to your repository
   - Click "Settings" tab
   - Scroll down to "Pages" section
   ```

2. **Configure Pages Settings**
   ```
   - Source: "Deploy from a branch"
   - Branch: main (or master)
   - Folder: / (root)
   - Click "Save"
   ```

3. **Wait for Deployment**
   ```
   - GitHub will provide a URL like:
   - https://yourusername.github.io/ammstro-website
   - Initial deployment takes 5-10 minutes
   ```

### **Step 3: Verify Deployment**

✅ **Check these items:**
- [ ] Website loads without errors
- [ ] Company logo displays (top navigation)
- [ ] All aviation images load properly
- [ ] Company section shows (not pricing)
- [ ] Interactive dashboard works
- [ ] Navigation functions correctly
- [ ] Mobile responsive design

---

## 🔧 **Method 2: GitHub Actions (Advanced)**

### **Step 1: Create Workflow File**

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy AMMSTRO Website

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build website
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### **Step 2: Configure Repository**

1. **Enable GitHub Actions**
   ```
   - Repository Settings → Pages
   - Source: "GitHub Actions"
   - Save settings
   ```

2. **Push Changes**
   ```
   - Commit and push the workflow file
   - GitHub Actions will automatically build and deploy
   - Check "Actions" tab for deployment status
   ```

---

## 📁 **Method 3: Manual Build Upload**

### **Step 1: Local Build**

```bash
# Extract the zip file
unzip ammstro-github-corrected.zip
cd ammstro-github-clean

# Install dependencies
npm install

# Build for production
npm run build
```

### **Step 2: Upload Build Files**

```
- Upload contents of 'dist' folder to your web hosting
- Ensure all files maintain their folder structure
- Configure your web server to serve index.html
```

---

## 🔍 **Troubleshooting**

### **Images Not Loading**

**Problem:** Aviation images show as broken links

**Solutions:**
1. **Check Console Errors**
   ```
   - Open browser Developer Tools (F12)
   - Look for 404 errors in Console tab
   - Verify image paths start with /assets/
   ```

2. **Verify File Structure**
   ```
   ✅ Correct structure:
   repository-root/
   ├── assets/
   │   ├── ammstro-logo.png
   │   ├── hangar-maintenance.jpg
   │   └── ...
   └── src/
   ```

3. **Check GitHub Pages Settings**
   ```
   - Ensure Pages is enabled
   - Verify correct branch is selected
   - Wait 5-10 minutes after changes
   ```

### **Build Failures**

**Problem:** GitHub Actions build fails

**Solutions:**
1. **Check Node.js Version**
   ```yaml
   # In workflow file, ensure:
   node-version: '18'  # or '20'
   ```

2. **Verify Dependencies**
   ```bash
   # Locally test build:
   npm install
   npm run build
   ```

3. **Check Build Logs**
   ```
   - Go to repository "Actions" tab
   - Click on failed workflow
   - Review error messages
   ```

### **Website Not Updating**

**Problem:** Changes don't appear on live site

**Solutions:**
1. **Clear Browser Cache**
   ```
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Or use incognito/private browsing mode
   ```

2. **Check Deployment Status**
   ```
   - Repository → Environments → github-pages
   - Verify latest deployment succeeded
   ```

3. **Wait for Propagation**
   ```
   - GitHub Pages updates can take 5-10 minutes
   - Check again after waiting
   ```

---

## 🌐 **Custom Domain Setup (Optional)**

### **Step 1: Configure DNS**

```
# Add CNAME record in your DNS provider:
Type: CNAME
Name: www (or subdomain)
Value: yourusername.github.io
```

### **Step 2: Update GitHub Settings**

```
- Repository Settings → Pages
- Custom domain: www.yourdomain.com
- Save and wait for DNS verification
```

---

## 📊 **Performance Optimization**

### **Image Optimization**
- All aviation images are already optimized
- Total package size: ~23MB
- Images compressed for web delivery

### **Build Optimization**
- Vite build system for fast loading
- CSS and JavaScript minification
- Asset bundling and optimization

### **Caching Strategy**
- Static assets cached by GitHub Pages
- Optimal cache headers automatically applied

---

## 🔐 **Security Considerations**

### **Repository Settings**
- Keep repository public for free GitHub Pages
- Sensitive data should not be in client-side code
- All API keys should be environment variables

### **Content Security**
- All images are properly licensed aviation photos
- No external dependencies with security risks
- Modern React security best practices applied

---

## 📱 **Mobile Responsiveness**

The website is fully responsive and tested on:
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)
- ✅ Touch-friendly navigation
- ✅ Optimized images for all screen sizes

---

## 🎨 **Features Included**

### **Company Information**
- **Vision:** "Drive aviation excellence through intelligent automation"
- **Mission:** "Revamp aircraft maintenance with a unified, predictive platform"
- **Leadership Team:** Sam (CEO), Fahmi (Vice CEO), Huzairi (COO), Harrith (CTO), Arman (CIO)
- **Business Metrics:** Revenue, margins, growth projections

### **Interactive Dashboard**
- AI-powered maintenance assistant
- Real-time chat functionality with typing effects
- Fleet overview with live data simulation
- Professional aviation industry styling

### **Aviation Content**
- Professional aircraft maintenance imagery
- Commercial aviation (Boeing 737, Airbus A320)
- Military aircraft maintenance operations
- Helicopter maintenance and operations
- Industry-specific terminology and content

---

## 📞 **Support & Maintenance**

### **Regular Updates**
- Update dependencies monthly: `npm update`
- Monitor GitHub security alerts
- Test functionality after major updates

### **Content Updates**
- Company information: Edit `src/App.jsx`
- Images: Replace files in `assets/` folder
- Styling: Modify `src/App.css` or Tailwind classes

### **Backup Strategy**
- GitHub repository serves as primary backup
- Download repository zip regularly
- Keep local development environment updated

---

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] Extract zip file completely
- [ ] Verify all files present (src/, assets/, config files)
- [ ] Check image file sizes and formats
- [ ] Review company information accuracy

### **During Deployment**
- [ ] Repository created and configured
- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled and configured
- [ ] Custom domain configured (if applicable)

### **Post-Deployment**
- [ ] Website loads without errors
- [ ] All images display correctly
- [ ] Interactive features work
- [ ] Mobile responsiveness verified
- [ ] Performance tested
- [ ] SEO basics implemented

---

## 🎯 **Success Metrics**

After successful deployment, you should have:

- **Professional Website** showcasing AMMSTRO's aviation expertise
- **Fast Loading Times** optimized for user experience
- **Mobile-Friendly Design** accessible on all devices
- **Interactive Features** engaging potential clients
- **Professional Imagery** demonstrating capabilities
- **Company Branding** consistent throughout

---

## 📈 **Next Steps**

### **Analytics Setup**
- Add Google Analytics for visitor tracking
- Monitor user engagement and popular sections
- Track conversion metrics

### **SEO Optimization**
- Add meta descriptions and keywords
- Implement structured data for aviation industry
- Optimize images with alt text

### **Content Expansion**
- Add case studies and success stories
- Include client testimonials
- Expand service descriptions

---

**🚀 Your AMMSTRO website is now ready for professional deployment!**

For additional support or questions, refer to the GitHub Pages documentation or contact your development team.

