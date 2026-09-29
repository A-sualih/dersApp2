#!/bin/bash

echo "============================================"
echo "በኡስታዝ አቡ ሰልዋ ሁሴን ስዩም ሉምአቱል ኢእቲቃድ"
echo "============================================"
echo ""
echo "Starting application..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Start the web server
echo "Starting web server at http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""
cd "$(dirname "$0")"
python3 -m http.server 8000 --directory dist