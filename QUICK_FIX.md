# Quick Fix for ERR_CONNECTION_RESET

## ✅ Good News: Your Site IS Live!

The site `https://yashwa39.github.io/canvas/` is actually working and accessible. The connection reset error is likely a browser or network issue.

## Immediate Solutions

### Solution 1: Hard Refresh (Most Common Fix)
- **Windows/Linux**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: Press `Cmd + Shift + R`
- This clears the cache and reloads the page

### Solution 2: Clear Browser Cache
1. Open Chrome Settings
2. Go to **Privacy and Security** → **Clear browsing data**
3. Select **Cached images and files**
4. Click **Clear data**
5. Try accessing the site again

### Solution 3: Try Incognito/Private Mode
- **Chrome**: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- **Firefox**: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
- Open the URL in private mode: `https://yashwa39.github.io/canvas/`

### Solution 4: Try Different Browser
- If Chrome shows error, try Firefox or Edge
- Sometimes browser extensions can cause connection issues

### Solution 5: Disable Browser Extensions
Some extensions (ad blockers, VPNs, security tools) can interfere:
1. Open Chrome in incognito mode (extensions disabled by default)
2. Or disable extensions one by one to find the culprit

### Solution 6: Check Network/Firewall
- Try a different network (mobile hotspot, different WiFi)
- Disable VPN if active
- Check if corporate/school firewall is blocking GitHub Pages

### Solution 7: Flush DNS Cache
**Windows:**
```bash
ipconfig /flushdns
```

**Mac:**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
```

### Solution 8: Direct Access Test
Try these URLs directly:
- `https://yashwa39.github.io/canvas/index.html`
- `https://yashwa39.github.io/canvas/` (with trailing slash)

## Verify Site is Working

You can verify the site is live by running this in terminal:

```bash
curl -I https://yashwa39.github.io/canvas/
```

If you see `HTTP/2 200`, the site is working!

## Still Not Working?

1. **Wait 5-10 minutes** - Sometimes GitHub Pages needs time to propagate
2. **Check GitHub Pages Settings**: https://github.com/yashwa39/canvas/settings/pages
   - Should show: "Your site is live at https://yashwa39.github.io/canvas/"
3. **Check Repository Visibility**: Make sure it's **Public**
4. **Try from Mobile**: Access from your phone's browser to test if it's network-specific

## Alternative: Run Locally

If GitHub Pages continues to have issues, run locally:

```bash
npm install
npm start
```

Then open: `http://localhost:8080/index.html`

---

**Most likely fix**: Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`) or try incognito mode!

