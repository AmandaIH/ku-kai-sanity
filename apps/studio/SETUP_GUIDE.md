# Internationalization Setup Guide

This guide explains how to properly set up internationalization for both new projects and fixing existing broken states.

## 🆕 New Project Setup

### Step 1: Initial Configuration
1. Ensure your `config/internationalization.ts` is properly configured
2. Make sure all schema types have the language field
3. Start your Sanity Studio

### Step 2: Create Site Settings Documents
1. Go to **Content > Site Settings**
2. Click on **"Quick Create (if missing)"**
3. Create documents for each language:
   - Click **"Create Danish Site Settings"**
   - Fill in the required fields and save
   - Click **"Create English Site Settings"**
   - Fill in the required fields and save

### Step 4: Verify Translation Links
1. Open either siteSettings document
2. Look for translation links or metadata fields
3. Ensure both documents are properly linked

## 🔧 Fixing Broken States

### If Documents Appear Locked

#### Method 1: Quick Create (Recommended)
1. Go to **Content > Site Settings**
2. Scroll down to **"Quick Create (if missing)"**
3. Click on the language you need to recreate (e.g., "Create English Site Settings")
4. Fill in the required fields
5. **Save** the document

#### Method 2: Vision Tool Cleanup
1. Go to **Vision** in your Sanity Studio
2. Run this query to see the current state:
   ```groq
   *[_type == "siteSettings" || _type == "sanity.documentInternationalization.metadata"]
   ```
3. Look for:
   - Missing siteSettings documents
   - Orphaned metadata documents
   - Broken translation links
4. Delete any problematic metadata documents
5. Create missing siteSettings documents using Method 1

#### Method 3: Complete Reset (Nuclear Option)
⚠️ **Warning: This will delete all siteSettings data**

1. In Vision, run:
   ```groq
   *[_type == "siteSettings" || _type == "sanity.documentInternationalization.metadata"]
   ```
2. Delete all returned documents
3. Follow the "New Project Setup" steps above

## 🎯 Best Practices

### Do's ✅
- **Use the structure navigation** to access documents
- **Create both language versions** from the start
- **Use the Quick Create section** if documents are missing
- **Backup before major changes**
- **Test both languages** after setup

### Don'ts ❌
- **Don't delete siteSettings documents directly**
- **Don't manually edit document IDs**
- **Don't ignore translation metadata**
- **Don't skip creating both language versions**

## 🔍 Troubleshooting

### "Document not found" Error
- Use the Quick Create section to recreate missing documents
- Check that document IDs follow the pattern: `siteSettings-{language}`

### "Permission denied" Error
- Check your Sanity project permissions
- Verify you're logged in with the correct account

### Translation Links Not Working
- Ensure both documents exist
- Check that language fields are set correctly
- Verify metadata documents are intact

### Structure Not Updating
- Restart the Sanity Studio development server
- Clear browser cache
- Check for TypeScript compilation errors

## 📋 Setup Checklist

### For New Projects
- [ ] Internationalization config is set up
- [ ] All schemas have language fields
- [ ] Danish siteSettings document created
- [ ] English siteSettings document created
- [ ] Translation links are working
- [ ] Both languages are tested

### For Fixing Broken States
- [ ] Current state assessed via Vision
- [ ] Problematic metadata documents identified
- [ ] Missing documents recreated via Quick Create
- [ ] Translation relationships restored
- [ ] Both languages are working

## 🆘 Emergency Recovery

If everything is broken and you can't access any documents:

1. **Don't panic** - your data is likely still there
2. **Use Vision** to inspect the database state
3. **Identify what's missing** vs what's broken
4. **Use Quick Create** to recreate missing documents
5. **Contact support** if you need help with database cleanup

## 📞 Getting Help

If you're still stuck:

1. **Check the browser console** for errors
2. **Look at the Sanity Studio logs**
3. **Use Vision** to inspect your data
4. **Refer to the troubleshooting guide**
5. **Contact the development team** 