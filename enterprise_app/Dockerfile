FROM node:18-alpine AS build
WORKDIR /app

# فعّل pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# لو عندك باكيجات فيها native modules، فكّ التعليقات:
# RUN apk add --no-cache python3 make g++

# استفيد من الكاش: انسخ ملفات الاعتماد أولاً
COPY package.json pnpm-lock.yaml ./

# تثبيت بجدّية
RUN pnpm install --frozen-lockfile

# انسخ السورس والبِلد
COPY . .
ARG VITE_API_URL
ARG VITE_SOCKET_URL
RUN VITE_API_URL=$VITE_API_URL VITE_SOCKET_URL=$VITE_SOCKET_URL pnpm build

# سيرفر Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
