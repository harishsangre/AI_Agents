# Multi-Tenant AI Agent SaaS Platform

A production-ready SaaS platform for creating, managing, and deploying AI agents with isolated knowledge bases, PDF processing, vector search, and embeddable widgets.

## Features

- **Google OAuth Authentication**: Seamless login with Google
- **Multi-Tenant Architecture**: Complete tenant isolation and data security
- **AI Agent Management**: Create and manage unlimited AI agents
- **PDF Knowledge Base**: Upload and process PDFs as knowledge bases
- **Vector Search**: Pinecone-powered semantic search
- **Embeddable Widgets**: Deploy chat widgets on external websites
- **Scalable Architecture**: Built for thousands of concurrent users
- **Enterprise Security**: JWT, role-based access, rate limiting

## Tech Stack

**Frontend**: React 19, Vite, TypeScript, TailwindCSS, ShadCN UI
**Backend**: Python 3.12, FastAPI, Motor, Pydantic
**Database**: MongoDB
**Vector DB**: Pinecone
**Storage**: AWS S3 / MinIO
**Cache**: Redis
**Task Queue**: Celery
**Deployment**: Docker, Docker Compose, Nginx

## Quick Start

```bash
# Clone repository
git clone https://github.com/harishsangre/AI_Agents.git
cd AI_Agents

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker
docker-compose up -d

# Access platform
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Security Guide](docs/SECURITY.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## License

MIT