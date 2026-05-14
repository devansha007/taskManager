#!/bin/bash
set -e

echo "==> Running migrations..."
python manage.py migrate

echo "==> Starting Celery worker..."
celery -A core worker --loglevel=info &

echo "==> Starting Celery beat..."
celery -A core beat --loglevel=info &

echo "==> Starting Gunicorn..."
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2