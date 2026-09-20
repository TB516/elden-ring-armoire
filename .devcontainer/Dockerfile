FROM node:24.19.0-bookworm

RUN npm install --global pnpm@11.23.0
ENV pnpm_config_store_dir=/home/node/.local/share/pnpm/store
WORKDIR /workspace
RUN mkdir -p node_modules "$pnpm_config_store_dir" && chown -R node:node /workspace /home/node/.local
USER node
