# Troubleshooting Internationalization Issues

This guide helps resolve common issues with the internationalization setup.

## 🔒 Site Settings Documents Appear Locked

### Problem
After deleting a siteSettings document (e.g., the English one), the remaining documents may appear locked or inaccessible.

### Why This Happens
The `@sanity/document-internationalization` plugin creates metadata documents that link translations together. When you delete one document, it can break the translation relationship and cause the remaining documents to appear locked.

### Solutions

#### Option 1: Use the "Create Missing Documents" Section
1. Go to **Content > Site Settings**
2. Scroll down to **"Create Missing Documents"**
3. Click on the language you need to recreate (e.g., "Create English Site Settings")
4. Fill in the required fields and save

#### Option 2: Manual Recreation
1. Go to **Content > Site Settings**
2. Click on the existing document (e.g., "Site Settings - Danish")
3. In the document editor, look for translation links or metadata
4. Create a new document with the correct language field
5. Use the document ID format: `siteSettings-{language}` (e.g., `siteSettings-en`)

#### Option 3: Reset via Vision Tool
1. Go to **Vision** in the Sanity Studio
2. Run this query to see all siteSettings documents:
   ```groq
   *[_type == "siteSettings"]
   ```
3. Check if there are any metadata documents that might be causing issues
4. If needed, delete problematic metadata documents and recreate the siteSettings

#### Option 4: Database Cleanup (Advanced)
If the above doesn't work, you may need to clean up the database:

1. **Backup your data first!**
2. Go to **Vision** and run:
   ```groq
   *[_type == "siteSettings" || _type == "sanity.documentInternationalization.metadata"]
   ```
3. Look for any orphaned or broken metadata documents
4. Delete the problematic metadata documents
5. Recreate the siteSettings documents

### Prevention
- **Don't delete siteSettings documents directly** - use the translation interface instead
- **Always create both language versions** when setting up new projects
- **Use the structure navigation** rather than direct document access

## 🔄 Translation Links Not Working

### Problem
Translation links between documents are not working or showing correctly.

### Solution
1. Check that both documents have the correct `language` field set
2. Ensure the document internationalization plugin is properly configured
3. Verify that metadata documents exist for the translation pairs

## 📝 Missing Language Field

### Problem
New documents don't have the language field or it's not showing correctly.

### Solution
1. Check that the schema includes `commonFields.language`
2. Verify the schema is properly exported in `schemaTypes/index.ts`
3. Restart the Sanity Studio development server

## 🏗️ Structure Not Updating

### Problem
Changes to the internationalization configuration don't appear in the structure.

### Solution
1. Restart the Sanity Studio development server
2. Clear your browser cache
3. Check that the configuration file is properly imported
4. Verify TypeScript compilation is successful

## 🐛 Common Error Messages

### "Document not found"
- The document may have been deleted or moved
- Check the document ID in the URL
- Use the structure navigation to find the correct document

### "Permission denied"
- Check your Sanity project permissions
- Verify you're logged in with the correct account
- Contact your project administrator

### "Schema validation failed"
- Check that all required fields are filled
- Verify the language field is set correctly
- Ensure the document follows the schema structure

## 🆘 Getting Help

If you're still experiencing issues:

1. **Check the browser console** for JavaScript errors
2. **Look at the Sanity Studio logs** for server-side errors
3. **Verify your environment variables** are set correctly
4. **Check the Sanity documentation** for the latest plugin information

## 📋 Quick Checklist

Before reporting an issue, verify:

- [ ] All environment variables are set
- [ ] Sanity Studio is running the latest version
- [ ] All schema types are properly exported
- [ ] The internationalization configuration is correct
- [ ] Browser cache is cleared
- [ ] No TypeScript compilation errors 