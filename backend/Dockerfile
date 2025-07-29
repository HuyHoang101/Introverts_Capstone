# Dockerfile cho ứng dụng Node.js
# Chạy Node
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở cổng backend
EXPOSE 5000

# Lệnh chạy backend
CMD ["node", "index.js"]

