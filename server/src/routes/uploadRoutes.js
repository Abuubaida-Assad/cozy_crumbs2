import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}

// @desc   Upload image from admin dashboard (base64 Data URL or file payload)
// @route  POST /api/upload
// @access Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { image, filename = 'upload.jpg' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // If it's already an HTTP URL or local path, return as is
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
      return res.json({ success: true, url: image });
    }

    // Match base64 header: data:image/png;base64,...
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 image data or URL' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine extension
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';

    const cleanBaseName = filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 30);
    const uniqueFileName = `${Date.now()}_${cleanBaseName || 'bake'}.${ext}`;

    try {
      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;
      return res.status(201).json({
        success: true,
        url: publicUrl,
        message: 'Image uploaded successfully',
      });
    } catch (writeErr) {
      // In Vercel serverless, local filesystem writes are ephemeral or read-only
      console.warn('[Upload Warning] Serverless filesystem write rejected:', writeErr.message);
      return res.status(400).json({
        success: false,
        message: 'Direct file upload to local disk is not supported on Vercel Serverless. Please paste an image URL (from Cloudinary, Unsplash, Imgur, etc.) directly into the image field.',
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
