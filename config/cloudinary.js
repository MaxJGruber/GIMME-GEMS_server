const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// CLOUDINARY CONFIG SETUP

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key : process.env.CLOUDINARY_KEY ,
    api_secret: process.env.CLOUDINARY_SECRET
});

// CREATING NEW STORAGE FOLDER FOR CLOUDINARY FILES

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "Treender",
    allowedFormat: ["png", "jpg"],
    fileName: (req, file, clbk) => {
        clbk(null, file.originalName)
    },
});

const uploadCloud = multer({
    storage: storage
});

module.exports = uploadCloud
