pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "fareselsobky/k8s-demo-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/root/.kube/config-jenkins"
        DEPLOY_ATTEMPTED = "false"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG -t $DOCKER_IMAGE:latest ./app'
            }
        }

        stage('Run Tests Inside Container') {
            steps {
                echo 'Running tests inside Docker container...'
                sh 'docker run --rm $DOCKER_IMAGE:$IMAGE_TAG npm test'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push $DOCKER_IMAGE:$IMAGE_TAG'
                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Updating Kubernetes deployment image...'
                script {
                    env.DEPLOY_ATTEMPTED = "true"
                }
                sh 'kubectl set image deployment/webapp-deployment webapp=$DOCKER_IMAGE:$IMAGE_TAG'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes rollout...'
                sh 'kubectl rollout status deployment/webapp-deployment --timeout=120s'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'

            script {
                if (env.DEPLOY_ATTEMPTED == "true") {
                    echo 'Deployment was attempted. Rolling back Kubernetes deployment...'
                    sh 'kubectl rollout undo deployment/webapp-deployment || true'
                } else {
                    echo 'Deployment was not attempted. Skipping rollback.'
                }
            }
        }
    }
}