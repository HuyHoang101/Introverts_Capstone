# Dockerfile
FROM node:20-alpine
WORKDIR /app

# 1) Copy file khai báo deps trước để tận dụng cache
COPY package*.json ./

# 2) Cài tất cả deps (kể cả dev) để có prisma CLI cho bước generate
RUN npm install

# 3) Copy toàn bộ source (bao gồm prisma/schema.prisma)
COPY . .

# 4) Generate Prisma Client (cần prisma CLI đã có ở bước 2)
RUN npx prisma generate

# 5) Prune dev deps để image gọn cho production
RUN npm prune --omit=dev

# 6) (Tuỳ chọn) Bảo mật nhẹ
# RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
# USER nodeuser

EXPOSE 5000

# Sửa path entry cho đúng dự án của bạn:
# Nếu file chạy là src/index.js:
# CMD ["node", "src/index.js"]
# Nếu là index.js ở root thì đổi thành:
CMD ["node", "index.js"]
