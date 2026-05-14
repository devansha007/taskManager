# taskapi/Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Start Gunicorn
# CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
# CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2
# CMD python manage.py migrate && \
#     celery -A core worker --loglevel=info --detach && \
#     gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2

# CMD python manage.py migrate && \
#     celery -A core worker --loglevel=info --detach --logfile=/tmp/celery.log && \
#     celery -A core beat --loglevel=info --detach --logfile=/tmp/celerybeat.log && \
#     gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2

EXPOSE 8000

CMD ["bash", "start.sh"]