# Sử dụng Node.js base image
FROM node:20

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies và xây dựng bcrypt từ source
RUN npm install bcrypt --build-from-source
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng (NestJS)
RUN npm run build

# Mở cổng cho ứng dụng
EXPOSE 3001

# Khởi chạy ứng dụng
CMD ["npm", "run", "start:prod"]
