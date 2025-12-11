#!/bin/bash

# piDash Startup Script
# Runs both the API server and serves the static dashboard files

PIDASH_DIR="/home/pi/piDash"
API_PORT=3001
WEB_PORT=3000

echo "🚀 Starting piDash..."

# Navigate to piDash directory
cd "$PIDASH_DIR" || exit 1

# Start API server in background
echo "🔧 Starting API server on port $API_PORT..."
node server/config-api.js > /tmp/pidash-api.log 2>&1 &
API_PID=$!
echo "  API server running (PID: $API_PID)"

# Wait a moment for API to start
sleep 2

# Check if npx is available for http-server
if command -v npx &> /dev/null; then
    echo "🌐 Starting web server on port $WEB_PORT..."
    npx http-server dist -p $WEB_PORT --cors -c-1 > /tmp/pidash-web.log 2>&1 &
    WEB_PID=$!
    echo "  Web server running (PID: $WEB_PID)"
elif command -v python3 &> /dev/null; then
    echo "🌐 Starting Python web server on port $WEB_PORT..."
    cd dist
    python3 -m http.server $WEB_PORT > /tmp/pidash-web.log 2>&1 &
    WEB_PID=$!
    cd ..
    echo "  Web server running (PID: $WEB_PID)"
else
    echo "❌ Error: No web server available (need npx or python3)"
    kill $API_PID
    exit 1
fi

# Save PIDs for stopping later
echo $API_PID > /tmp/pidash-api.pid
echo $WEB_PID > /tmp/pidash-web.pid

echo ""
echo "✅ piDash started successfully!"
echo ""
echo "📊 Access dashboard at:"
echo "   http://localhost:$WEB_PORT"
echo ""
echo "🔧 API server at:"
echo "   http://localhost:$API_PORT"
echo ""
echo "📝 Logs:"
echo "   API: tail -f /tmp/pidash-api.log"
echo "   Web: tail -f /tmp/pidash-web.log"
echo ""
echo "🛑 To stop: kill $(cat /tmp/pidash-api.pid) $(cat /tmp/pidash-web.pid)"
