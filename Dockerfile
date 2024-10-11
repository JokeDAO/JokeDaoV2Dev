FROM node:18-alpine AS base

WORKDIR /app
COPY . .

# Install
RUN yarn --production 

# Build
ENV NEXT_TELEMETRY_DISABLED=1 # disable telemetry during the build

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_R2_ACCOUNT_ID
ARG NEXT_PUBLIC_R2_ACCESS_KEY_ID
ARG NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ARG NEXT_PUBLIC_MERKLE_TREES_BUCKET
ARG NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET
ARG NEXT_PUBLIC_ETHERSCAN_KEY
ARG NEXT_PUBLIC_QUICKNODE_SLUG
ARG NEXT_PUBLIC_QUICKNODE_KEY
ARG NEXT_PUBLIC_ALCHEMY_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL 
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_R2_ACCOUNT_ID=$NEXT_PUBLIC_R2_ACCOUNT_ID
ENV NEXT_PUBLIC_R2_ACCESS_KEY_ID=$NEXT_PUBLIC_R2_ACCESS_KEY_ID
ENV NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=$NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_MERKLE_TREES_BUCKET=$NEXT_PUBLIC_MERKLE_TREES_BUCKET
ENV NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET=$NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET
ENV NEXT_PUBLIC_ETHERSCAN_KEY=$NEXT_PUBLIC_ETHERSCAN_KEY
ENV NEXT_PUBLIC_QUICKNODE_SLUG=$NEXT_PUBLIC_QUICKNODE_SLUG
ENV NEXT_PUBLIC_QUICKNODE_KEY=$NEXT_PUBLIC_QUICKNODE_KEY
ENV NEXT_PUBLIC_ALCHEMY_KEY=$NEXT_PUBLIC_ALCHEMY_KEY

RUN yarn build

# Serve
ENV NEXT_TELEMETRY_DISABLED=1 # disable telemetry during runtime.

CMD ["yarn", "start"]
