FROM node:18.20.4

# Set working directory
WORKDIR /app

# Cài đặt Angular CLI toàn cầu (để sử dụng ng serve)
RUN npm install -g @angular/cli

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy mã nguồn từ máy chủ vào container (từ volume)
COPY . .

# Expose cổng mà Angular sẽ chạy
EXPOSE 80  

# Lệnh mặc định để chạy ứng dụng Angular
CMD ["npm", "start", "--", "--port", "80"]
