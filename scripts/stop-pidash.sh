#!/bin/bash

# piDash Stop Script

echo "🛑 Stopping piDash..."

# Stop API server
if [ -f /tmp/pidash-api.pid ]; then
    API_PID=$(cat /tmp/pidash-api.pid)
    if kill -0 $API_PID 2>/dev/null; then
        kill $API_PID
        echo "  Stopped API server (PID: $API_PID)"
    fi
    rm -f /tmp/pidash-api.pid
fi

# Stop web server
if [ -f /tmp/pidash-web.pid ]; then
    WEB_PID=$(cat /tmp/pidash-web.pid)
    if kill -0 $WEB_PID 2>/dev/null; then
        kill $WEB_PID
        echo "  Stopped web server (PID: $WEB_PID)"
    fi
    rm -f /tmp/pidash-web.pid
fi

echo "✅ piDash stopped"
