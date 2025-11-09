pipeline {
    agent any
    
    environment {
        // Deploy on the same EC2 instance where Jenkins is running
        DEPLOY_PATH = '/home/ubuntu/book'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    echo 'Deploying to EC2 instance...'
                    
                    // SSH into EC2 and deploy
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${DEPLOY_SERVER} '
                            cd ${DEPLOY_PATH} && \
                            git pull origin main && \
                            docker compose down && \
                            docker compose build --no-cache && \
                            docker compose up -d && \
                            echo "Deployment completed successfully!"
                        '
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo 'Verifying deployment...'
                    
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${DEPLOY_SERVER} '
                            cd ${DEPLOY_PATH} && \
                            docker compose ps
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline executed successfully!'
            echo 'Application deployed to EC2: http://ec2-18-215-168-23.compute-1.amazonaws.com'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}
