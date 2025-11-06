# Safari HTTPS Fix - Step by Step

## The Problem
Safari is automatically upgrading HTTP requests to HTTPS for localhost, causing SSL errors.

## Solution Steps:

### Step 1: Check Security Settings
1. In Safari, go to **Safari → Settings → Security** (the padlock icon)
2. Look for any settings about:
   - "Always use HTTPS"
   - "Upgrade insecure requests"
   - "HSTS" or "HTTP Strict Transport Security"
3. Disable any of these if found

### Step 2: Clear HSTS Cache (Terminal)
Run these commands in Terminal:
```bash
defaults delete com.apple.Safari HSTS
defaults delete com.apple.Safari HSTS.plist
killall Safari
```

### Step 3: Clear Website Data
1. Safari → Settings → Privacy
2. Click **"Manage Website Data..."**
3. Search for **"localhost"**
4. Select all localhost entries
5. Click **"Remove"**
6. Click **"Done"**

### Step 4: Clear Safari Cache
1. Safari → Develop → Empty Caches (or press Cmd+Option+E)
2. Safari → Clear History → All History

### Step 5: Restart Safari
1. Quit Safari completely (Cmd+Q)
2. Reopen Safari
3. Go to: `http://localhost:3000` (make sure it says HTTP, not HTTPS)

### Alternative: Use Different Hostname
If the above doesn't work, use a different hostname:

1. Edit `/etc/hosts`:
   ```bash
   sudo nano /etc/hosts
   ```

2. Add this line:
   ```
   127.0.0.1 dev.local
   ```

3. Save and restart your dev server

4. In Safari, go to: `http://dev.local:3000`

This bypasses Safari's localhost-specific behavior.

