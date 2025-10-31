#!/bin/bash

# Start HTTP server in background
echo "Starting HTTP server on port 8000..."
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!

echo "Server started with PID: $SERVER_PID"
echo ""
echo "🌐 Test file is available at: http://localhost:8000/test-web-app.html"
echo "🌐 Main app is available at: http://localhost:8000/index.html"
echo ""
echo "Opening test file in browser..."
echo ""
sleep 2

# Try to open in browser (macOS)
if command -v open &> /dev/null; then
    open "http://localhost:8000/test-web-app.html"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:8000/test-web-app.html"
fi

echo "Press Ctrl+C to stop the server..."
echo ""

# Wait for user interrupt
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID; exit" INT TERM
wait $SERVER_PID
