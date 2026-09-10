import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc   Upload image from admin dashboard (base64 Data URL or file payload)
// @route  POST /api/upload
// @access Private/Admin (or token guarded)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { image, filename = 'upload.jpg' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    // Match base64 header: data:image/png;base64,...
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an HTTP URL or local path, return as is
      if (image.startsWith('http') || image.startsWith('/')) {
        return res.json({ success: true, url: image });
      }
      return res.status(400).json({ success: false, message: 'Invalid base64 image data' });
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
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return res.status(201).json({
      success: true,
      url: publicUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
