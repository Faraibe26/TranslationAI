#!/bin/bash
# Backend Testing Script for PharmaLingo
# This script tests the backend API to ensure it's working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the backend URL from argument or use default
BACKEND_URL="${1:-http://localhost:8000}"

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}PharmaLingo Backend Test Suite${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""
echo "Testing backend at: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check (GET /)${NC}"
if response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/"); then
  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | head -1)
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
    echo "Response: $body"
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    echo "Response: $body"
  fi
else
  echo -e "${RED}✗ FAILED${NC} - Could not connect to $BACKEND_URL"
  exit 1
fi

echo ""

# Test 2: Translation Endpoint - Spanish
echo -e "${YELLOW}Test 2: Translation Endpoint (POST /api/translate) - Spanish${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, how are you?","target_language":"es"}')

http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
  echo "Response: $body"
else
  echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
  echo "Response: $body"
fi

echo ""

# Test 3: Translation Endpoint - French
echo -e "${YELLOW}Test 3: Translation Endpoint - French${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Do you have any allergies?","target_language":"fr"}')

http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$http_code" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
  echo "Response: $body"
else
  echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
  echo "Response: $body"
fi

echo ""

# Test 4: CORS Headers
echo -e "${YELLOW}Test 4: CORS Headers${NC}"
response=$(curl -s -i -X OPTIONS "$BACKEND_URL/api/translate" \
  -H "Origin: https://translation-ai-phi.vercel.app" \
  -H "Access-Control-Request-Method: POST" 2>/dev/null | grep -i "access-control")

if [ -n "$response" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - CORS headers present"
  echo "$response"
else
  echo -e "${YELLOW}⚠ WARNING${NC} - No CORS headers detected"
fi

echo ""

# Test 5: Invalid Request Handling
echo -e "${YELLOW}Test 5: Error Handling (Empty Text)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"","target_language":"es"}')

http_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$http_code" = "400" ]; then
  echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code - Correctly rejected empty text)"
  echo "Response: $body"
else
  echo -e "${YELLOW}⚠ WARNING${NC} (HTTP $http_code - Expected 400)"
  echo "Response: $body"
fi

echo ""
echo -e "${YELLOW}================================${NC}"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "${YELLOW}================================${NC}"
