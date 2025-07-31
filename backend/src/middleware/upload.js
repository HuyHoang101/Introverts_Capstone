import multer from 'multer';
const storage = multer.memoryStorage(); // Lưu file trên RAM
export const upload = multer({ storage });
