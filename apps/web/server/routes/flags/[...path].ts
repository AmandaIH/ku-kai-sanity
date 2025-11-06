// Server route to serve SVG flags with correct headers for production
import { defineEventHandler, setHeader, createError } from 'h3';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || '';
  
  // Security: Only allow SVG files
  if (!path.endsWith('.svg')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only SVG files are allowed'
    });
  }
  
  // Try multiple possible locations for the public directory
  // In production, files might be in different locations depending on deployment
  const cwd = process.cwd();
  const possiblePaths = [
    // Development
    join(cwd, 'public', 'flags', path),
    // Production - Nitro output
    join(cwd, '.output', 'public', 'flags', path),
    // Monorepo structure
    join(cwd, 'apps', 'web', 'public', 'flags', path),
    // Absolute path from project root
    resolve(cwd, 'public', 'flags', path),
    resolve(cwd, 'apps', 'web', 'public', 'flags', path),
  ];
  
  let filePath: string | null = null;
  let fileContent: string | null = null;
  
  // Try to find the file
  for (const possiblePath of possiblePaths) {
    if (existsSync(possiblePath)) {
      filePath = possiblePath;
      try {
        fileContent = await readFile(possiblePath, 'utf-8');
        break;
      } catch (error) {
        // Continue to next path
        continue;
      }
    }
  }
  
  // If still not found, try using Nitro's public assets
  if (!fileContent) {
    try {
      const storage = useStorage('assets');
      const keys = await storage.getKeys('flags');
      const matchingKey = keys.find((key: string) => key.endsWith(path));
      if (matchingKey) {
        fileContent = await storage.getItem(matchingKey) as string;
      }
    } catch (error) {
      // Ignore storage errors
    }
  }
  
  // If still not found, return 404
  if (!fileContent) {
    throw createError({
      statusCode: 404,
      statusMessage: `Flag file not found: ${path}. Checked paths: ${possiblePaths.join(', ')}`
    });
  }
  
  // Set proper headers for SVG files
  setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8');
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  
  // Return the file content
  return fileContent;
});

