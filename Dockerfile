FROM nginx:alpine
# Copy repository into nginx html folder so index.html is reachable at /
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
