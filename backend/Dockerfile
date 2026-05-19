# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables BEFORE copying anything
ENV HOST=0.0.0.0
ENV PORT=8000

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application with uvicorn directly
# Do NOT use --reload in production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
