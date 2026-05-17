# Kubernetes CI/CD Demo Project

This project demonstrates a Node.js web application connected to MongoDB and deployed on Kubernetes.

## Current components

- Node.js web application
- MongoDB database
- Kubernetes Deployment
- Kubernetes Service
- Kubernetes Ingress
- ConfigMap
- Secret
- PersistentVolumeClaim
- Prometheus and Grafana monitoring

## Planned CI/CD

The next step is to add a Jenkins pipeline that:

1. Builds the Docker image
2. Pushes the image to Docker Hub
3. Updates the Kubernetes deployment
4. Verifies the rollout