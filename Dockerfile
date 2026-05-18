# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory in container
WORKDIR /app

# Copy the entire project
COPY . .

# Change to backend directory and install requirements
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV PORT=8000

# Run the application
CMD ["python", "main.py"]
