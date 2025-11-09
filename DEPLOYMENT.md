# Docker Deployment Guide for EC2

## 📋 Prerequisites
- EC2 instance (Ubuntu 22.04 LTS recommended)
- Security Group allowing ports: 80 (HTTP), 443 (HTTPS), 22 (SSH)
- Docker and Docker Compose installed on EC2

## 🚀 Quick Start on EC2

### 1. Install Docker on EC2
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add user to docker group (replace 'ubuntu' with your username)
sudo usermod -aG docker ubuntu
newgrp docker

# Verify installation
docker --version
docker compose version
```

### 2. Upload Project to EC2
```bash
# On your local machine (use SCP or rsync)
rsync -avz -e "ssh -i your-key.pem" \
  --exclude 'node_modules' \
  --exclude '.git' \
  ./ ubuntu@your-ec2-ip:/home/ubuntu/bookstore/
```

### 3. Configure Environment
```bash
# On EC2 instance
cd /home/ubuntu/bookstore
cp .env.docker .env
# Edit .env with your production values
nano .env
```

### 4. Build and Run
```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Check logs
docker compose logs -f

# Check status
docker compose ps
```

### 5. Seed Database (Optional)
```bash
# Run seed script inside backend container
docker compose exec backend npm run seed:books
```

## 🔧 Useful Commands

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Restart Services
```bash
# All services
docker compose restart

# Specific service
docker compose restart backend
```

### Stop/Start
```bash
# Stop all
docker compose down

# Start all
docker compose up -d

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

## 🗄️ Database Backup & Restore

### Backup MongoDB
```bash
# Create backup
docker compose exec -T mongodb mongodump --db=hogwarts_bookstore --archive > backup_$(date +%Y%m%d).archive

# Or export to JSON
docker compose exec mongodb mongoexport --db=hogwarts_bookstore --collection=books --out=/tmp/books.json
docker cp bookstore-mongodb:/tmp/books.json ./backup/
```

### Restore MongoDB
```bash
# Restore from archive
docker compose exec -T mongodb mongorestore --archive < backup_20241109.archive

# Or import JSON
docker cp ./backup/books.json bookstore-mongodb:/tmp/
docker compose exec mongodb mongoimport --db=hogwarts_bookstore --collection=books --file=/tmp/books.json
```

## 🔐 Security Recommendations for Production

### 1. Use HTTPS (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 2. Add Nginx SSL to docker-compose.yml
Update frontend service to mount SSL certificates:
```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
  ports:
    - "443:443"
    - "80:80"
```

### 3. MongoDB Authentication
Add to docker-compose.yml:
```yaml
mongodb:
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
```

### 4. Environment Variables
- Never commit `.env` files
- Use strong passwords
- Rotate credentials regularly

## 📊 Monitoring

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/api/book

# Frontend
curl http://localhost/

# MongoDB
docker compose exec mongodb mongosh --eval "db.runCommand({ ping: 1 })"
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker compose logs backend

# Check if port is in use
sudo lsof -i :5000

# Restart Docker daemon
sudo systemctl restart docker
```

### MongoDB connection issues
```bash
# Check MongoDB logs
docker compose logs mongodb

# Test connection
docker compose exec backend node -e "console.log(process.env.MONGO_URI)"
```

### Out of disk space
```bash
# Clean Docker resources
docker system prune -a --volumes

# Check disk usage
df -h
```

## 🔄 CI/CD Integration (Optional)

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/bookstore
            git pull origin main
            docker compose down
            docker compose build
            docker compose up -d
```

## 📝 URLs After Deployment

- **Frontend**: http://your-ec2-ip or https://yourdomain.com
- **Backend API**: http://your-ec2-ip:5000/api or https://yourdomain.com/api
- **MongoDB**: localhost:27017 (only accessible from EC2)

## 💰 Cost Optimization

- Use **t3.small** or **t3.medium** EC2 instance (~$15-30/month)
- Enable **auto-shutdown** during off-hours
- Use **Reserved Instances** for 40-60% savings
- Clean up unused Docker images regularly

## 🆘 Support

For issues, check logs:
```bash
docker compose logs -f --tail=100
```

Test endpoints:
```bash
# Backend health
curl http://localhost:5000/api/book

# Database connection
docker compose exec backend node -e "require('./lib/mongoose.js').connectMongo().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Failed:', e.message))"
```
