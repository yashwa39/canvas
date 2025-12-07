# Troubleshooting GitHub Pages - ERR_CONNECTION_RESET

If you're seeing "ERR_CONNECTION_RESET" or "This site can't be reached" when accessing your GitHub Pages site, follow these steps:

## Step 1: Verify Repository is Public

GitHub Pages on free accounts only works with **public repositories**.

1. Go to: https://github.com/yashwa39/canvas
2. Click **Settings** (top menu)
3. Scroll down to **Danger Zone** → **Change repository visibility**
4. Make sure the repository is set to **Public**

## Step 2: Enable GitHub Pages

1. Go to: https://github.com/yashwa39/canvas/settings/pages
2. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
3. Click **Save**
4. Wait 1-5 minutes for GitHub to deploy

## Step 3: Check Deployment Status

1. Go to: https://github.com/yashwa39/canvas/actions
2. Look for "pages build and deployment" workflow
3. If it shows a green checkmark ✅, deployment succeeded
4. If it shows an error ❌, click on it to see the error details

## Step 4: Verify Files Are Pushed

Make sure all files are committed and pushed:

```bash
git status
git push origin main
```

Required files:
- ✅ index.html
- ✅ style.css
- ✅ script.js
- ✅ .nojekyll (important for GitHub Pages)

## Step 5: Clear Browser Cache

1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache for the site
3. Try incognito/private mode

## Step 6: Check URL

The correct URL format is:
- ✅ `https://yashwa39.github.io/canvas/`
- ✅ `https://yashwa39.github.io/canvas/index.html`

NOT:
- ❌ `http://yashwa39.github.io/canvas/` (must use HTTPS)
- ❌ `https://github.com/yashwa39/canvas` (this is the repo, not the site)

## Step 7: Wait for DNS Propagation

After enabling GitHub Pages, it can take:
- **1-5 minutes** for initial deployment
- **Up to 24 hours** for DNS to fully propagate globally

## Step 8: Check GitHub Pages Status

Visit: https://github.com/yashwa39/canvas/settings/pages

You should see:
- ✅ "Your site is live at https://yashwa39.github.io/canvas/"
- ✅ Green checkmark next to deployment status

## Common Issues

### Issue: "Repository not found"
- **Solution**: Make sure the repository is public
- **Solution**: Check the repository name matches exactly

### Issue: "404 Not Found"
- **Solution**: Wait a few more minutes for deployment
- **Solution**: Verify `index.html` is in the root directory
- **Solution**: Check that `.nojekyll` file exists

### Issue: "ERR_CONNECTION_RESET"
- **Solution**: Repository might be private (make it public)
- **Solution**: GitHub Pages might not be enabled
- **Solution**: Wait for deployment to complete
- **Solution**: Try a different browser or network

### Issue: Site loads but shows blank page
- **Solution**: Open browser console (F12) and check for errors
- **Solution**: Verify all CDN links are accessible
- **Solution**: Check that camera permissions are granted

## Quick Test

After enabling GitHub Pages, test with:

```bash
curl -I https://yashwa39.github.io/canvas/
```

You should see `HTTP/2 200` if the site is live.

## Still Not Working?

1. Check GitHub status: https://www.githubstatus.com/
2. Verify repository settings: https://github.com/yashwa39/canvas/settings
3. Check Actions tab for deployment errors: https://github.com/yashwa39/canvas/actions
4. Try accessing from a different network/device

## Alternative: Use Local Development

If GitHub Pages continues to have issues, you can run locally:

```bash
npm install
npm start
```

Then open: `http://localhost:8080/index.html`

