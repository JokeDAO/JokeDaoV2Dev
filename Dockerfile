FROM node:18-alpine AS base

FROM base AS builder

# Install
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
WORKDIR /app
COPY . .

RUN yarn --production 

# Build
# disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1 

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

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Set the correct permission for prerender cache
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/packages/react-app-revamp/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/packages/react-app-revamp/.next/static ./.next/static 
COPY --from=builder /app/packages/react-app-revamp/public ./public 

USER nextjs

# Exposed port (for orchestrators and dynamic reverse proxies)
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "wget", "-q0", "http://localhost:3000/health" ]

CMD ["node", "server.js"]
