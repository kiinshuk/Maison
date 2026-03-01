#!/usr/bin/env bash
# Render build script
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input --settings=backend.settings_prod
python manage.py migrate --settings=backend.settings_prod
python seed_data.py
