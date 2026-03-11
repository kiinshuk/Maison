"""Production settings — used on Render."""
from .settings import *
import os
import dj_database_url
from django.http import JsonResponse

SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')

DEBUG = False

ALLOWED_HOSTS = [
    '.onrender.com',
    'localhost',
    '127.0.0.1',
    'maison-dzus.onrender.com',
]

# Allow your Vercel frontend domain
_frontend_url = os.environ.get('FRONTEND_URL', '').strip()
CORS_ALLOWED_ORIGINS = [
    'https://maison-seven-pi.vercel.app',
    'https://maison.vercel.app',
]
# Also add any extra URL from env var
if _frontend_url.startswith('http') and _frontend_url not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(_frontend_url)
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['Content-Type']
CORS_ALLOW_HEADERS = ['*']

# Database — Render provides DATABASE_URL env var for PostgreSQL
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', f'sqlite:///{BASE_DIR}/db.sqlite3'),
        conn_max_age=600,
        ssl_require=False,
    )
}

# Static files served by WhiteNoise
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files - Cloudinary or local storage
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Backend URL for generating full media URLs in API
BACKEND_URL = os.environ.get('BACKEND_URL', 'https://maison-dzus.onrender.com')

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY', '')
CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET', '')
CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL', '')

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    if 'cloudinary_storage' not in INSTALLED_APPS:
        INSTALLED_APPS = list(INSTALLED_APPS) + ['cloudinary_storage']
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
        'API_KEY': CLOUDINARY_API_KEY,
        'API_SECRET': CLOUDINARY_API_SECRET,
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
