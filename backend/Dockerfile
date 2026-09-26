FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

COPY backend/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/main.py ./
COPY backend/start.py ./
COPY backend/entrypoint.sh ./

RUN chmod +x entrypoint.sh

EXPOSE 8080

CMD ["./entrypoint.sh"]