# Safari Localhost HTTPS Fix

## The Problem
Safari is trying to load resources over HTTPS (`https://localhost:3000`) instead of HTTP, causing SSL errors and preventing CSS/styles from loading.

## Solutions (try in order):

### Solution 1: Clear Safari's HSTS Cache (RECOMMENDED)

1. **Close Safari completely**

2. **Open Terminal and run:**
   ```bash
   defaults delete com.apple.Safari HSTS
   killall Safari
   ```

3. **Restart Safari**

4. **Go to:** `http://localhost:3000` (make sure it's HTTP, not HTTPS)

### Solution 2: Use 127.0.0.1 Instead

1. **Start your dev server with:**
   ```bash
   SAFARI_FIX=true pnpm run dev:web
   ```

2. **In Safari, go to:** `http://127.0.0.1:3000` (instead of localhost)

   This bypasses Safari's HSTS cache because 127.0.0.1 is treated differently than localhost.

### Solution 3: Manual HSTS Clear (if Terminal doesn't work)

1. Open Safari
2. Go to **Safari → Settings → Privacy**
3. Click **"Manage Website Data..."**
4. Search for **"localhost"**
5. Select all localhost entries
6. Click **"Remove"**
7. Click **"Done"**
8. Restart Safari

### Solution 4: Reset Safari Completely (last resort)

1. Safari → Settings → Advanced
2. Check "Show Develop menu in menu bar"
3. Develop → Empty Caches
4. Safari → Clear History (All History)
5. Restart Safari

## After Fixing

Once HSTS is cleared, you should be able to use `http://localhost:3000` normally in Safari.

The server-side and client-side fixes we've added will handle any remaining HTTPS URL issues automatically.

