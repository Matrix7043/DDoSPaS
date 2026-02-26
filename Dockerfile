FROM openresty/openresty:alpine

COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY lua/ /usr/local/openresty/nginx/lua

EXPOSE 8080

CMD ["openresty", "-g", "daemon off;"]