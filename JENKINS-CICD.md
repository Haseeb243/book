# Jenkins CI/CD Pipeline Setup

## 🎉 Setup Complete!

Your automated CI/CD pipeline is now fully configured and ready to use!

## Architecture Overview

```
GitHub Repository (push) 
    ↓ (webhook)
Jenkins Server (ec2-3-85-243-204)
    ↓ (SSH deploy)
Production Server (ec2-18-215-168-23)
    ↓
Docker Containers (MongoDB, Backend, Frontend)
```

## Components Configured

### 1. GitHub Webhook
- **URL**: `http://ec2-3-85-243-204.compute-1.amazonaws.com:8080/github-webhook/`
- **Content Type**: application/json
- **Events**: Push events to `main` branch
- **Status**: ✅ Active and tested (ping successful)

### 2. Jenkins Job: BookStore-Deploy
- **Type**: Pipeline
- **SCM**: Git
- **Repository**: https://github.com/Haseeb243/book.git
- **Branch**: */main
- **Script Path**: Jenkinsfile
- **Triggers**: GitHub hook trigger for GITScm polling

### 3. SSH Credentials
- **ID**: ec2-ssh-key
- **Username**: ubuntu
- **Type**: SSH Username with private key
- **Scope**: Global
- **Purpose**: Authenticate to EC2 deployment server

## Pipeline Stages

The Jenkinsfile defines 3 automated stages:

### Stage 1: Checkout
- Pulls latest code from GitHub repository

### Stage 2: Deploy to EC2
Executes on **ec2-18-215-168-23.compute-1.amazonaws.com**:
1. `git pull` - Update code
2. `docker compose down` - Stop running containers
3. `docker compose build --no-cache` - Rebuild images
4. `docker compose up -d` - Start new containers

### Stage 3: Verify Deployment
- Runs `docker compose ps` to verify containers are running

## How It Works

1. **Developer pushes code** to GitHub `main` branch
2. **GitHub webhook** automatically triggers Jenkins build
3. **Jenkins** pulls latest code from GitHub
4. **Jenkins** connects to EC2 via SSH using `ec2-ssh-key` credential
5. **Docker Compose** rebuilds and restarts containers on EC2
6. **Verification** ensures all containers are running

## Testing the Pipeline

### Option 1: Make a code change and push
```bash
# Make any change to your code
echo "# Test CI/CD" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main

# Jenkins will automatically start building!
```

### Option 2: Trigger manual build
1. Go to http://ec2-3-85-243-204.compute-1.amazonaws.com:8080/job/BookStore-Deploy/
2. Click "Build Now"
3. Monitor the Console Output

## Monitoring Builds

### Jenkins Dashboard
- **Job Page**: http://ec2-3-85-243-204.compute-1.amazonaws.com:8080/job/BookStore-Deploy/
- Click on build number (e.g., #1) to see details
- Click "Console Output" to see real-time logs

### What to Watch For
✅ **SUCCESS** - Green checkmark, deployment completed
❌ **FAILURE** - Red X, check Console Output for errors

## Common Issues & Solutions

### Build Fails with "Permission denied (publickey)"
**Problem**: SSH credential not working
**Solution**: 
- Verify credential ID in Jenkinsfile matches "ec2-ssh-key"
- Check EC2 security group allows SSH from Jenkins server

### Build Fails at Docker Commands
**Problem**: Docker not available or permission issues
**Solution**:
```bash
# SSH to deployment server
ssh -i /home/kali/Downloads/key.pem ubuntu@ec2-18-215-168-23.compute-1.amazonaws.com

# Verify Docker is running
docker ps

# Check Docker Compose
docker compose version
```

### GitHub Webhook Not Triggering
**Problem**: Webhook not delivering events
**Solution**:
1. Go to GitHub → Settings → Webhooks
2. Click on the webhook
3. Check "Recent Deliveries" tab for errors
4. Verify Jenkins server is accessible from internet

## Environment Variables

If you need to update environment variables:

1. **Backend .env** (on EC2 at `/home/ubuntu/book/Backend/.env`):
   - Database connection
   - API keys
   - Port configuration

2. **docker-compose.yml** (on EC2 at `/home/ubuntu/book/docker-compose.yml`):
   - Container configuration
   - Volume mounts
   - Network settings

## Rollback Procedure

If a deployment goes wrong:

```bash
# SSH to deployment server
ssh -i /home/kali/Downloads/key.pem ubuntu@ec2-18-215-168-23.compute-1.amazonaws.com

# Navigate to project
cd /home/ubuntu/book

# Checkout previous working version
git log --oneline
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

## URLs

- **Jenkins**: http://ec2-3-85-243-204.compute-1.amazonaws.com:8080/
- **Production App**: http://ec2-18-215-168-23.compute-1.amazonaws.com/
- **GitHub Repo**: https://github.com/Haseeb243/book

## Next Steps

### Recommended Enhancements

1. **Add Tests to Pipeline**
   - Run unit tests before deployment
   - Add integration tests

2. **Notifications**
   - Email notifications on build success/failure
   - Slack integration

3. **Staging Environment**
   - Deploy to staging first
   - Manual approval for production

4. **Backup Strategy**
   - Automated database backups before deployment
   - Container image tagging with build numbers

5. **Monitoring**
   - Add health checks in pipeline
   - Monitor container logs

## Security Notes

⚠️ **Important**:
- SSH private key is stored securely in Jenkins credentials
- Never commit `.env` files or secrets to Git
- GitHub webhook uses HTTP (not HTTPS) - consider adding SSL/TLS
- EC2 security groups should restrict SSH access to Jenkins server IP only

## Support

For issues:
1. Check Jenkins Console Output first
2. SSH to servers to inspect logs: `docker compose logs`
3. Review GitHub webhook delivery logs
4. Check EC2 security group rules

---

**🚀 Your automated CI/CD pipeline is ready! Every push to `main` will automatically deploy to production.**
