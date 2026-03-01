"""Production settings — used on Render."""
from .settings import *
import os
import dj_database_url

SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')

DEBUG = False

ALLOWED_HOSTS = [
    '.onrender.com',
    'localhost',
    '127.0.0.1',
]

# Allow your Vercel frontend domain
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'https://your-app.vercel.app'),
]
CORS_ALLOW_CREDENTIALS = True

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

# Media files (use external storage like S3 in real prod)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
