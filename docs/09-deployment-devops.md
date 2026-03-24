# Deployment & DevOps Documentation

## GIGS-Rental Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Status:** Development + Production Planning

---

## Table of Contents

1. [Development Environment](#1-development-environment)
2. [Build Process](#2-build-process)
3. [Deployment Architecture](#3-deployment-architecture)
4. [CI/CD Pipeline](#4-cicd-pipeline)
5. [Environment Configuration](#5-environment-configuration)
6. [Monitoring and Logging](#6-monitoring-and-logging)
7. [Backup and Recovery](#7-backup-and-recovery)
8. [Scaling Strategy](#8-scaling-strategy)

---

## 1. Development Environment

### 1.1 Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | 18.x or 20.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 11.10.1 | Included with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |

### 1.2 Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd GIGS-Rental

# Install dependencies
npm install

# Start development servers
npm run dev
```

### 1.3 Development Ports

| Application | Port | URL |
|-------------|------|-----|
| Web (Marketing) | 8888 | http://localhost:8888 |
| Dashboard | 3001 | http://localhost:3001 |
| Backend API | 3000 | http://localhost:3000 |

### 1.4 Local Development Architecture

```mermaid
flowchart TB
    subgraph "Developer Machine"
        DEV[Development Environment]
        
        subgraph "Running Applications"
            WEB[web\n:8888]
            DASH[dashboard\n:3001]
            API[backend\n:3000]
        end
        
        subgraph "Browser"
            CHROME[Chrome]
            FIREFOX[Firefox]
        end
        
        subgraph "Data Storage"
            LOCAL[(localStorage)]
        end
    end
    
    DEV --> WEB
    DEV --> DASH
    DEV --> API
    WEB --> CHROME
    DASH --> CHROME
    WEB --> LOCAL
    DASH --> LOCAL
```

---

## 2. Build Process

### 2.1 Turborepo Pipeline

```mermaid
flowchart LR
    subgraph "Build Pipeline"
        A[Clean] --> B[Lint]
        B --> C[Type Check]
        C --> D[Build UI]
        D --> E[Build Auth]
        E --> F[Build Config]
        F --> G[Build Web]
        G --> H[Build Dashboard]
        H --> I[Build Backend]
    end
    
    subgraph "Outputs"
        G --> OUT1[.next/ web]
        H --> OUT2[.next/ dashboard]
        I --> OUT3[dist/ backend]
    end
```

### 2.2 Build Commands

```bash
# Build all applications
npm run build

# Build specific application
npm run build:backend
npm run build:dashboard
npm run build:web

# Type checking
npm run typecheck

# Linting
npm run lint
```

### 2.3 Build Outputs

| Application | Output Directory | Contents |
|-------------|------------------|----------|
| web | `apps/web/.next/` | Static files, SSR bundles |
| dashboard | `apps/dashboard/.next/` | Static files, SSR bundles |
| backend | `apps/backend/dist/` | Compiled JavaScript |
| ui | `packages/ui/dist/` | Component library |
| auth | `packages/auth/dist/` | Auth utilities |

### 2.4 Build Configuration

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    }
  }
}
```

---

## 3. Deployment Architecture

### 3.1 Production Architecture

```mermaid
flowchart TB
    subgraph "User Layer"
        USERS[Users]
    end
    
    subgraph "CDN Layer"
        CF[Cloudflare CDN]
    end
    
    subgraph "Edge Layer"
        VERCEL[Vercel Edge Network]
        WEB[web App]
        DASH[dashboard App]
    end
    
    subgraph "API Layer"
        LB[Load Balancer]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance 3]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Primary)]
        DB_REPLICA[(PostgreSQL Replica)]
        REDIS[(Redis Cluster)]
        S3[(S3/Cloud Storage)]
    end
    
    subgraph "Monitoring"
        DD[Datadog/New Relic]
        SENTRY[Sentry]
    end
    
    USERS --> CF
    CF --> VERCEL
    VERCEL --> WEB
    VERCEL --> DASH
    WEB --> LB
    DASH --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    API1 --> DB
    API1 --> REDIS
    API1 --> S3
    API2 --> DB
    API3 --> DB
    DB --> DB_REPLICA
    API1 --> DD
    API1 --> SENTRY
```

### 3.2 Hosting Providers

| Service | Provider | Purpose |
|---------|----------|---------|
| Frontend (web) | Vercel | Next.js hosting, Edge functions |
| Frontend (dashboard) | Vercel | Next.js hosting, Edge functions |
| Backend API | AWS/GCP | Container hosting |
| Database | AWS RDS / GCP Cloud SQL | PostgreSQL |
| Cache | Redis Cloud / AWS ElastiCache | Session & caching |
| File Storage | AWS S3 / Cloudflare R2 | Image storage |
| CDN | Cloudflare | Static asset delivery |
| DNS | Cloudflare | DNS management |

### 3.3 Containerization

```dockerfile
# Dockerfile for backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build:backend

# Expose port
EXPOSE 3000

# Start
CMD ["node", "apps/backend/dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=gigs
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=gigs_rental
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 4. CI/CD Pipeline

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Test
        run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          # Deploy web app
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --target=preview
          
          # Deploy dashboard
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --target=preview

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Deploy web app
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --target=production --prod
          
          # Deploy dashboard
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --target=production --prod
```

### 4.2 Pipeline Stages

```mermaid
flowchart LR
    subgraph "Continuous Integration"
        A[Push/PR] --> B[Checkout]
        B --> C[Install]
        C --> D[Lint]
        D --> E[Type Check]
        E --> F[Test]
        F --> G[Build]
    end
    
    subgraph "Continuous Deployment"
        G --> H{Branch?}
        H -->|develop| I[Deploy Staging]
        H -->|main| J[Deploy Production]
    end
    
    subgraph "Post-Deploy"
        I --> K[Smoke Tests]
        J --> L[Smoke Tests]
        L --> M[Monitoring]
    end
```

### 4.3 Deployment Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost | Local development |
| Staging | staging.gigs-rental.com | Pre-production testing |
| Production | www.gigs-rental.com | Live application |

---

## 5. Environment Configuration

### 5.1 Environment Variables

#### Web Application (.env)
```bash
# Next.js
NEXT_PUBLIC_API_URL=https://api.gigs-rental.com
NEXT_PUBLIC_DASHBOARD_URL=https://app.gigs-rental.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx

# Analytics (future)
# NEXT_PUBLIC_GA_ID=xxx
# NEXT_PUBLIC_MIXPANEL_TOKEN=xxx
```

#### Dashboard Application (.env)
```bash
NEXT_PUBLIC_API_URL=https://api.gigs-rental.com
NEXT_PUBLIC_WEB_URL=https://www.gigs-rental.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
```

#### Backend Application (.env)
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/gigs_rental

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=xxx
JWT_EXPIRES_IN=24h

# OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# AWS (future)
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
# S3_BUCKET=xxx

# Email (future)
# SENDGRID_API_KEY=xxx
# SMTP_HOST=xxx
```

### 5.2 Environment File Structure

```
├── .env                    # Default (development)
├── .env.local              # Local overrides (gitignored)
├── .env.development        # Development environment
├── .env.staging            # Staging environment
└── .env.production         # Production environment
```

---

## 6. Monitoring and Logging

### 6.1 Monitoring Stack

```mermaid
flowchart TB
    subgraph "Applications"
        WEB[Web App]
        DASH[Dashboard]
        API[Backend API]
    end
    
    subgraph "Monitoring Tools"
        SENTRY[Sentry\nError Tracking]
        DD[Datadog\nAPM & Metrics]
        GRAFANA[Grafana\nVisualization]
        ALERT[PagerDuty\nAlerts]
    end
    
    subgraph "Log Aggregation"
        Loki[Loki\nLog Storage]
        PROM[Prometheus\nMetrics]
    end
    
    WEB --> SENTRY
    DASH --> SENTRY
    API --> SENTRY
    
    WEB --> DD
    DASH --> DD
    API --> DD
    
    API --> Loki
    Loki --> GRAFANA
    PROM --> GRAFANA
    GRAFANA --> ALERT
```

### 6.2 Key Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |
| CPU Usage | < 70% | > 85% |
| Memory Usage | < 80% | > 90% |
| Database Connections | < 80% | > 95% |
| Disk Usage | < 70% | > 85% |

### 6.3 Health Checks

```typescript
// Health check endpoint
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      checks: {
        database: await this.db.check(),
        redis: await this.redis.check(),
        storage: await this.storage.check(),
      },
    };
  }
}
```

---

## 7. Backup and Recovery

### 7.1 Backup Strategy

```mermaid
gantt
    title Backup Schedule
    dateFormat  YYYY-MM-DD
    section Automated
    Database Full Backup    :a1, 2026-01-01, 1d
    Database Incremental    :a2, after a1, 1d
    File Storage Backup     :a3, 2026-01-01, 1d
    
    section Retention
    Daily Backups           :crit, 2026-01-01, 7d
    Weekly Backups          :2026-01-07, 4w
    Monthly Backups         :2026-02-01, 12M
```

### 7.2 Backup Procedures

| Data Type | Frequency | Retention | Method |
|-----------|-----------|-----------|--------|
| PostgreSQL | Daily | 30 days | pg_dump + S3 |
| PostgreSQL | Weekly | 12 weeks | pg_dump + S3 |
| File Storage | Daily | 30 days | S3 versioning |
| Redis | Daily | 7 days | RDB snapshots |

### 7.3 Recovery Procedures

```bash
# Database recovery
# 1. Download backup from S3
aws s3 cp s3://gigs-backups/db/backup.sql.gz .

# 2. Restore to database
gunzip backup.sql.gz
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup.sql

# 3. Verify restoration
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;"
```

---

## 8. Scaling Strategy

### 8.1 Horizontal Scaling

```mermaid
flowchart TB
    subgraph "Load Balancer"
        LB[Nginx/ALB]
    end
    
    subgraph "API Tier (Auto Scaling)"
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance 3]
        API4[API Instance n...]
    end
    
    subgraph "Data Tier"
        DB[(PostgreSQL Primary)]
        REPLICA[(Read Replicas)]
        REDIS[(Redis Cluster)]
    end
    
    LB --> API1
    LB --> API2
    LB --> API3
    LB --> API4
    
    API1 --> DB
    API2 --> DB
    API3 --> REPLICA
    API4 --> REPLICA
    
    API1 --> REDIS
    API2 --> REDIS
```

### 8.2 Scaling Triggers

| Resource | Scale Up | Scale Down |
|----------|----------|------------|
| CPU | > 70% for 5 min | < 30% for 10 min |
| Memory | > 80% for 5 min | < 40% for 10 min |
| Requests/sec | > 1000/s | < 200/s |
| Response Time | > 500ms | < 200ms |

### 8.3 Database Scaling

**Read Scaling:**
- PostgreSQL read replicas
- Connection pooling (PgBouncer)
- Query caching (Redis)

**Write Scaling (Future):**
- Database sharding by region
- Write-through caching
- Async processing queues

---

## 9. Security

### 9.1 Security Checklist

```yaml
Infrastructure:
  - [ ] HTTPS only (TLS 1.3)
  - [ ] WAF (Web Application Firewall)
  - [ ] DDoS protection (Cloudflare)
  - [ ] VPC isolation
  - [ ] Security groups configured

Application:
  - [ ] Input validation
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CSRF tokens
  - [ ] Rate limiting
  - [ ] Security headers

Data:
  - [ ] Encryption at rest
  - [ ] Encryption in transit
  - [ ] PII handling compliant
  - [ ] Regular security audits
```

### 9.2 Security Headers

```typescript
// middleware.ts
export const securityHeaders = {
  'Content-Security-Policy': 'default-src \'self\'; script-src \'self\' \'unsafe-inline\'',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-24 | Technical Team | Initial deployment documentation |

---

*End of Deployment & DevOps Documentation*