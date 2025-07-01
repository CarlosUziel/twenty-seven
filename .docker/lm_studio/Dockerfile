# Dockerfile for LM Studio server
FROM ghcr.io/lmstudio-ai/lmstudio:latest

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 1234

# Use entrypoint to download models from env and start server
ENTRYPOINT ["/entrypoint.sh"]
CMD ["lmstudio", "start"]
