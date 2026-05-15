# frontend build
FROM node:24.15-trixie-slim AS frontend-builder
WORKDIR /frontend
# dockerのchacheを効かせるために先に依存をDL
COPY frontend/package*.json ./
RUN npm ci
# ビルド
COPY frontend/ .
RUN npm run build

# backend build
FROM golang:1.26.2-trixie AS backend-builder
WORKDIR /backend
# dockerのchacheを効かせるために先に依存をDL
COPY backend/go.mod backend/go.sum ./
RUN go mod download
# ビルド
COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

# runtime
FROM gcr.io/distroless/static-debian13:nonroot
WORKDIR /
COPY --from=backend-builder /backend/app /app
COPY --from=frontend-builder /frontend/dist /dist
EXPOSE 1323
CMD ["/app"]
