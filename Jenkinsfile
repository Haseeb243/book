pipeline {
    agent any
    
    environment {
        // Deploy on the same EC2 where Jenkins is running (using Jenkins workspace)
        DEPLOY_PATH = '.'  // Use current workspace directory
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Deploy Locally') {
            steps {
                script {
                    echo 'Deploying on Jenkins EC2 instance (localhost)...'
                    
                    // Deploy locally on the same machine where Jenkins runs
                    sh """
                        git pull origin main
                        docker compose down
                        docker compose build --no-cache
                        docker compose up -d
                        echo "Deployment completed successfully!"
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    echo 'Verifying deployment...'
                    
                    sh """
                        docker compose ps
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline executed successfully!'
            echo 'Application deployed to EC2: http://ec2-3-85-243-204.compute-1.amazonaws.com'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}