#!/bin/bash
set -e

# Cleanup any stale lock files
rm -f /tmp/.X1-lock

# Start Xvfb (X virtual framebuffer)
# We use screen 0 with resolution 1280x1024
Xvfb :1 -screen 0 1280x1024x24 &

# Export DISPLAY to tell Java where the X server is
export DISPLAY=:1

# Wait a bit for Xvfb to start
sleep 2

# Start a window manager so the app window looks and behaves correctly
openbox &

# Start x11vnc to share the Xvfb screen
# -forever keeps it running after disconnects
# -nopw removes password for easy access (internal dev environment)
x11vnc -display :1 -forever -nopw -bg

# Start the noVNC proxy to translate VNC to WebSocket/HTTP
# It will listen on 6080 and point to local VNC (5900)
/usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080 &

# Execute the original command passed to the container
exec "$@"
