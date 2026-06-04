# Stage 1: Install Composer Dependencies
FROM composer:2.7 as vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --ignore-platform-reqs --no-interaction --no-plugins --no-scripts --prefer-dist

# Stage 2: Compile Inertia React Frontend Assets
FROM node:20-alpine as frontend
WORKDIR /app
COPY package.json package-lock.json vite.config.ts tsconfig.json composer.json artisan ./
COPY app/ app/
COPY bootstrap/ bootstrap/
COPY config/ config/
COPY routes/ routes/
COPY resources/ resources/
COPY --from=vendor /app/vendor ./vendor

# --- ADD THESE LINES TO CAPTURE REVERB KEYS DURING BUILD ---
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME

ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY
ENV VITE_REVERB_HOST=$VITE_REVERB_HOST
ENV VITE_REVERB_PORT=$VITE_REVERB_PORT
ENV VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME
# -----------------------------------------------------------

RUN npm ci
RUN npm run build # This will now pass smoothly without needing PHP!

# Stage 3: Final Optimized PHP-FPM Image (Pre-configured for Laravel)
FROM serversideup/php:8.4-fpm-alpine

# Set uniform working directory matching your compose file
WORKDIR /var/www/html

# Copy application source code
COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=frontend --chown=www-data:www-data /app/public/build ./public/build

# Ensure runtime directories are writable by the server process
USER root
RUN mkdir -p storage framework bootstrap/cache && \
    chown -R www-data:www-data storage framework bootstrap/cache

USER www-data
EXPOSE 9000
CMD ["php-fpm"]




