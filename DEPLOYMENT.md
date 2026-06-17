# 🚀 Deployment Guide

Complete guide to deploy the AI Voice Assistant to production.

## Table of Contents
1. [AWS Deployment](#aws-deployment)
2. [Docker & Docker Compose](#docker--docker-compose)
3. [Vercel (Frontend)](#vercel-frontend)
4. [Heroku](#heroku)
5. [Performance Optimization](#performance-optimization)

---

## AWS Deployment

### Option 1: EC2 + RDS + Elastic Beanstalk

#### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- IAM user with EC2, RDS, and Elastic Beanstalk access

#### Step 1: Create RDS MySQL Instance

```bash
# Create security group for RDS
aws ec2 create-security-group \
  --group-name voice-assistant-db \
  --description "MySQL for Voice Assistant"

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier voice-assistant-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --db-name voice_assistant \
  --publicly-accessible false \
  --vpc-security-group-ids sg-xxxxx

# Get the RDS endpoint
aws rds describe-db-instances \
  --db-instance-identifier voice-assistant-mysql \
  --query 'DBInstances[0].Endpoint.Address'
```

#### Step 2: Deploy Backend to Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
cd backend
eb init voice-assistant --platform "Java 17 running on 64bit Amazon Linux 2" --region us-east-1

# Create environment
eb create voice-assistant-env

# Configure environment variables
eb setenv GEMINI_API_KEY=your-key SPRING_DATASOURCE_URL=jdbc:mysql://rds-endpoint:3306/voice_assistant SPRING_DATASOURCE_USERNAME=admin SPRING_DATASOURCE_PASSWORD=YourSecurePassword123!

# Deploy the application
eb deploy

# View the environment URL
eb open
```

#### Step 3: Deploy Frontend to CloudFront + S3

```bash
# Build React application
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://voice-assistant-frontend-prod

# Upload build files
aws s3 sync build/ s3://voice-assistant-frontend-prod/

# Update React API endpoint in .env
echo "REACT_APP_API_URL=https://your-eb-domain.com" > .env.production

# Rebuild with production API
npm run build

# Sync again
aws s3 sync build/ s3://voice-assistant-frontend-prod/

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name voice-assistant-frontend-prod.s3.amazonaws.com \
  --default-cache-behavior TargetOriginId=myS3Origin
```

### Option 2: Docker on AWS ECS

#### Step 1: Push Docker Images to ECR

```bash
# Create ECR repositories
aws ecr create-repository --repository-name voice-assistant-backend
aws ecr create-repository --repository-name voice-assistant-frontend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Build and tag backend image
cd backend
docker build -t voice-assistant-backend:latest .
docker tag voice-assistant-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/voice-assistant-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/voice-assistant-backend:latest

# Build and tag frontend image
cd ../frontend
docker build -t voice-assistant-frontend:latest .
docker tag voice-assistant-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/voice-assistant-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/voice-assistant-frontend:latest
```

#### Step 2: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name voice-assistant-cluster

# Create task definition (save as task-definition.json first)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster voice-assistant-cluster \
  --service-name voice-assistant-service \
  --task-definition voice-assistant-task \
  --desired-count 2 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=8080
```

---

## Docker & Docker Compose

### Local Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Stop services
docker-compose down
```

### Docker Registry Deployment

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag voice-assistant-backend:latest yourusername/voice-assistant-backend:latest
docker tag voice-assistant-frontend:latest yourusername/voice-assistant-frontend:latest

# Push images
docker push yourusername/voice-assistant-backend:latest
docker push yourusername/voice-assistant-frontend:latest

# Deploy on any Docker-enabled server
docker pull yourusername/voice-assistant-backend:latest
docker run -d \
  -e GEMINI_API_KEY=your-key \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-host:3306/voice_assistant \
  -p 8080:8080 \
  yourusername/voice-assistant-backend:latest
```

---

## Vercel (Frontend)

### Deploy React Frontend

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=https://your-backend-api.com
```

### GitHub Integration (Auto-Deploy)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel automatically deploys on push

---

## Heroku

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create Heroku app
heroku create voice-assistant-api

# Add MySQL addon
heroku addons:create jawsdb:kitefin --app voice-assistant-api

# Get database URL
heroku config:get JAWSDB_URL --app voice-assistant-api

# Set config variables
heroku config:set GEMINI_API_KEY=your-key --app voice-assistant-api

# Create Procfile in backend directory
echo "web: java -Dserver.port=\$PORT \$JAVA_OPTS -jar target/voice-assistant-1.0.0.jar" > Procfile

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy Frontend to Heroku

```bash
# Create Heroku app
heroku create voice-assistant-web

# Create Procfile
echo "web: npm run build && npm install -g serve && serve -s build -l \$PORT" > Procfile

# Set buildpacks
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main
```

---

## Performance Optimization

### Backend Optimization

#### 1. Enable Compression
```yaml
# application.yml
server:
  compression:
    enabled: true
    min-response-size: 1024
```

#### 2. Database Connection Pooling
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 20000
```

#### 3. Caching with Redis
```yaml
spring:
  redis:
    host: localhost
    port: 6379
  cache:
    type: redis
```

#### 4. Async Processing
```java
@Service
public class ChatService {
  @Async
  public CompletableFuture<String> chatAsync(String message) {
    return CompletableFuture.completedFuture(chat(message));
  }
}
```

### Frontend Optimization

#### 1. Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const ChatInterface = lazy(() => import('./components/ChatInterface'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatInterface />
    </Suspense>
  );
}
```

#### 2. Image Optimization
- Use WebP format for images
- Compress images before upload
- Use responsive images with srcset

#### 3. Service Worker
```javascript
// In public/service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/main.js',
        '/static/css/main.css'
      ]);
    })
  );
});
```

### Infrastructure Optimization

#### 1. CDN Integration
- Use CloudFront (AWS), Cloudflare, or Akamai
- Cache static assets globally
- Reduce latency for users worldwide

#### 2. Load Balancing
- Use AWS ELB, ALB, or NLB
- Distribute traffic across multiple instances
- Health checks for automatic failover

#### 3. Database Optimization
- Add indexes for frequently queried columns
- Use read replicas for read-heavy workloads
- Implement caching layer (Redis)

#### 4. Monitoring & Logging
```yaml
# application.yml
logging:
  level:
    root: INFO
    com.voiceassistant: DEBUG
  file:
    name: logs/application.log
    max-size: 10MB
    max-history: 10
```

---

## Monitoring & Alerts

### CloudWatch (AWS)

```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name voice-assistant-high-errors \
  --alarm-description "Alert when error rate > 5%" \
  --metric-name ErrorCount \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

### Application Performance Monitoring

Use services like:
- New Relic
- DataDog
- Dynatrace
- Application Insights

---

## Backup Strategy

### Database Backup

```bash
# Create RDS automated backup
aws rds modify-db-instance \
  --db-instance-identifier voice-assistant-mysql \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00"

# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier voice-assistant-mysql \
  --db-snapshot-identifier voice-assistant-mysql-backup-$(date +%Y%m%d)
```

### Code Backup

- Push to GitHub with branch protection
- Tag releases
- Maintain changelog

---

## Rollback Procedure

### AWS Elastic Beanstalk
```bash
# List versions
eb appversion

# Rollback to previous version
eb deploy -l voice-assistant-env --version <version-id>
```

### Docker
```bash
# Pull previous image version
docker pull yourusername/voice-assistant-backend:v1.0.0

# Run previous version
docker run -d --name backend-old yourusername/voice-assistant-backend:v1.0.0
```

---

## Cost Optimization

### Estimated Monthly Costs (AWS)

| Service | Size | Cost |
|---------|------|------|
| EC2 (t3.micro) | 1 instance | $8.50 |
| RDS MySQL | db.t3.micro | $15.00 |
| S3 Storage | 100GB | $2.30 |
| CloudFront | 1TB transfer | $85.00 |
| **Total** | | **~$111/month** |

### Cost Reduction Tips

1. Use spot instances for non-critical workloads
2. Enable auto-scaling based on traffic
3. Use managed services (RDS, S3) instead of self-managed
4. Implement caching to reduce database queries
5. Use reserved instances for predictable workloads

---

## Troubleshooting Deployment

### Issue: Backend can't connect to database
```bash
# Check security groups
aws ec2 describe-security-groups

# Test connection
mysql -h <rds-endpoint> -u admin -p
```

### Issue: High latency
- Check CloudWatch metrics
- Review database slow query logs
- Implement caching layer
- Check API response times

### Issue: Out of memory
```yaml
# Increase Java heap size
JAVA_OPTS: "-Xmx512m -Xms256m"
```

---

## Support Resources

- [AWS Documentation](https://docs.aws.amazon.com)
- [Docker Docs](https://docs.docker.com)
- [Spring Boot Deployment](https://spring.io/guides/gs/spring-boot-docker)
- [React Deployment](https://create-react-app.dev/deployment)

For questions, refer to the main README.md or create an issue in the repository.
