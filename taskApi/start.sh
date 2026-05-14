#!/bin/bash
python manage.py migrate
celery -A core worker --loglevel=info --detach --logfile=/tmp/celery.log --pidfile=/tmp/celery.pid
celery -A core beat --loglevel=info --detach --logfile=/tmp/celerybeat.log --pidfile=/tmp/celerybeat.pid
tail -f /tmp/celery.log &
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2