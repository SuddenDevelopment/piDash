#!/bin/bash

# Trigger deployment on Raspberry Pi via webhook

PI_HOST="raspberrypi.local"  # or use IP
WEBHOOK_PORT="9000"
WEBHOOK_SECRET="change-me-in-production"

echo "🚀 Triggering deployment on $PI_HOST..."

# Create signature
PAYLOAD='{"event":"deploy","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | sed 's/^.* //')"

# Send webhook
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -d "$PAYLOAD" \
  "http://$PI_HOST:$WEBHOOK_PORT/deploy")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment triggered successfully!"
    echo "$BODY"
else
    echo "❌ Deployment failed with code $HTTP_CODE"
    echo "$BODY"
    exit 1
fi
