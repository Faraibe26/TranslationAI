FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY main.py ./
COPY start.py ./
COPY entrypoint.sh ./

RUN chmod +x entrypoint.sh

EXPOSE 8080

CMD ["./entrypoint.sh"]