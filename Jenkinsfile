pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "fareselsobky/k8s-demo-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = "/root/.kube/config-jenkins"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE:$IMAGE_TAG ./app'
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
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Updating Kubernetes deployment image...'
                sh 'kubectl set image deployment/webapp-deployment webapp=$DOCKER_IMAGE:$IMAGE_TAG'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes rollout...'
                sh 'kubectl rollout status deployment/webapp-deployment'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins logs.'
        }
    }
}