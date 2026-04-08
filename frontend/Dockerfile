FROM eclipse-temurin:8-jre

# Install X11 and VNC tools
RUN apt-get update && apt-get install -y \
    xvfb \
    x11vnc \
    novnc \
    openbox \
    net-tools \
    procps \
    libxext6 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libx11-6 \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Copy entrypoint script to initialize the virtual display
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]

CMD ["java", "-Djava.awt.headless=false", "-jar", "target/inventory-frontend-1.0-SNAPSHOT.jar"]
