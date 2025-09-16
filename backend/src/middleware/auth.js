// src/middleware/auth.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'greensync-default-secret';

export const authenticateToken = (req, res, next) => {
  const hdr = req.headers['authorization'];
  const token = hdr?.startsWith('Bearer ') ? hdr.split(' ')[1] : hdr;

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid access token' });
    }
    // Chuẩn hoá để luôn có req.user.id, nhưng vẫn giữ nguyên payload cũ:
    const id = decoded?.id || decoded?.user?.id || decoded?.userId || decoded?.sub;
    if (!id) {
      return res.status(400).json({ error: 'Token payload missing user id' });
    }
    req.user = { ...decoded, id }; // giữ mọi field, thêm/ghi đè id
    next();
  });
};
