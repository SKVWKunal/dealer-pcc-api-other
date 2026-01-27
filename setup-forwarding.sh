#!/bin/bash

# Simple port forwarding setup for accessing Codespaces app from host machine
# This script exposes the application through a public tunnel

echo "🚀 Setting up alternative access methods..."
echo ""

# Check if ngrok is available
if command -v ngrok &> /dev/null; then
    echo "Using ngrok for public tunnel..."
    ngrok http 8080 --log=stdout &
    sleep 3
    echo ""
    echo "✅ Your application is now accessible via ngrok public URL"
    echo "   Check ngrok dashboard for the public URL"
    exit 0
fi

# Alternative: Use SSH tunneling for port forwarding
echo "Alternatively, use SSH port forwarding on your host machine:"
echo ""
echo "For Mac/Linux:"
echo "  ssh -L 8080:localhost:8080 <your-codespace-ssh-connection>"
echo ""
echo "Or access via VS Code's port forwarding:"
echo "  1. In VS Code, open the PORTS panel"
echo "  2. Look for port 8080"
echo "  3. Click the 'Open in Browser' icon"
echo ""

# Create a simple HTTP proxy in Node.js as fallback
cat > /tmp/proxy.js << 'PROXYEOF'
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    proxy.web(req, res, {target: 'http://localhost:8080'}, (err) => {
        res.writeHead(503, {'Content-Type': 'text/plain'});
        res.end('Service temporarily unavailable');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Proxy server running on port ${PORT}`);
});
PROXYEOF

echo "Creating a proxy server alternative..."
node /tmp/proxy.js &
sleep 2
echo ""
echo "✅ Proxy server is running on port 3001"
echo ""
