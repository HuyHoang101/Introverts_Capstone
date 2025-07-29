# Dockerfile cho ứng dụng Node.js
# Chạy Node
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Sao chép file Prisma schema
COPY . .

# Cài đặt Prisma CLI
RUN npx prisma generate

# Copy toàn bộ code
COPY . .

# Mở cổng backend
EXPOSE 5000

# Lệnh chạy backend
CMD ["node", "index.js"]

