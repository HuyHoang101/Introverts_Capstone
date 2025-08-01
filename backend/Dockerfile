# Dockerfile cho ứng dụng Node.js
# Chạy Node
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Cài dependencies
COPY . .

RUN npm install

# Cài đặt Prisma CLI
RUN npx prisma generate
# Mở cổng backend
EXPOSE 5000

# Lệnh chạy backend
CMD ["node", "index.js"]

