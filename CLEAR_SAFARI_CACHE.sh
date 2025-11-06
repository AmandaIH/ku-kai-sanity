#!/bin/bash
# Script to clear Safari's cache and HSTS for localhost

echo "Clearing Safari HSTS cache..."
defaults delete com.apple.Safari HSTS 2>/dev/null || echo "No HSTS cache found"

echo "Killing Safari..."
killall Safari 2>/dev/null || echo "Safari not running"

echo ""
echo "✅ Done! Now:"
echo "1. Restart Safari"
echo "2. Go to: http://localhost:3000"
echo "3. Make sure it says HTTP (not HTTPS) in the address bar"

