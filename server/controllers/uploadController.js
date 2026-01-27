const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cinema_posters', // Folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => {
            // Remove extension from original name for public_id, add random suffix
            const name = file.originalname.split('.')[0];
            return `${name}-${Date.now()}`;
        }
    }
});

const upload = multer({ storage: storage }).single('image');

exports.uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ error: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file selected' });
        }

        // Return the Cloudinary URL
        // req.file.path contains the secure cloudinary url
        res.json({ url: req.file.path });
    });
};
