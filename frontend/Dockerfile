# Frontend — React + Vite
# Build: docker build -t wedding-frontend --build-arg VITE_API_URL=http://localhost:8080/api ./frontend
# VITE_API_URL là build-time arg (Vite nhúng vào bundle lúc build), nên phải
# truyền qua --build-arg / docker-compose args, không dùng runtime env.
# Image chạy `vite preview` để phục vụ bản build trên cổng 5173.
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
