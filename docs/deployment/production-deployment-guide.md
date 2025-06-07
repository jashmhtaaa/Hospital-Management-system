# Hospital Management System Production Deployment Guide

## Overview

This guide provides detailed instructions for deploying the Hospital Management System (HMS) to the production environment. It covers the prerequisites, deployment steps, verification procedures, and rollback process. The deployment uses a blue-green strategy to ensure zero downtime.

## Prerequisites

### Infrastructure Requirements

1. **Kubernetes Cluster**:
   - Kubernetes v1.25 or later
   - At least 3 worker nodes per availability zone
   - Minimum 8 vCPUs and 32GB RAM per node
   - Configured with cluster autoscaling

2. **Database**:
   - PostgreSQL 14.0 or later
   - Primary-replica configuration with at least 3 replicas
   - Automatic failover configured
   - Minimum 16 vCPUs and 64GB RAM for primary
   - Minimum 8 vCPUs and 32GB RAM for each replica

3. **Redis Cluster**:
   - Redis 7.0 or later
   - At least 3 master nodes and 3 replica nodes
   - Configured for high availability
   - Minimum 4 vCPUs and 16GB RAM per node

4. **Object Storage**:
   - S3-compatible storage
   - Configured for cross-region replication
   - Appropriate bucket policies and permissions

5. **Monitoring**:
   - Prometheus and Grafana
   - ELK stack (Elasticsearch, Logstash, Kibana)
   - Jaeger for distributed tracing
   - AlertManager for alerting

6. **Networking**:
   - Load balancer configured with SSL termination
   - Web Application Firewall (WAF)
   - Content Delivery Network (CDN) for static assets
   - DDoS protection

### Tool Requirements

1. **kubectl** - Kubernetes command-line tool
2. **helm** - Kubernetes package manager
3. **argocd** - Continuous delivery tool
4. **jq** - Command-line JSON processor
5. **aws-cli** or equivalent - Cloud provider CLI
6. **curl** - Command-line tool for making HTTP requests

### Security Requirements

1. **SSL Certificates**:
   - Valid SSL certificates for all domains
   - Configured in the Kubernetes cluster

2. **Secrets Management**:
   - HashiCorp Vault or equivalent
   - Secrets for database credentials, API keys, etc.

3. **Authentication**:
   - Identity provider configuration
   - Service accounts with appropriate permissions

### Access Requirements

1. **Kubernetes Cluster Access**:
   - Admin access to the Kubernetes cluster
   - Access to Kubernetes API server

2. **Database Access**:
   - Admin access to the PostgreSQL database
   - Access to database management tools

3. **Cloud Provider Access**:
   - Admin access to the cloud provider console
   - Access to cloud provider APIs

## Deployment Steps

### 1. Pre-Deployment Preparation

1. **Validate Prerequisites**:
   ```bash
   # Check Kubernetes cluster status
   kubectl cluster-info
   kubectl get nodes -o wide
   
   # Check database connectivity
   PGPASSWORD=<password> psql -h <hostname> -U <username> -d <database> -c "SELECT version();"
   
   # Check Redis connectivity
   redis-cli -h <hostname> -p <port> -a <password> ping
   ```

2. **Backup Current Environment**:
   ```bash
   # Backup database
   PGPASSWORD=<password> pg_dump -h <hostname> -U <username> -d <database> -F c -f hms_backup_$(date +%Y%m%d%H%M%S).dump
   
   # Upload backup to secure storage
   aws s3 cp hms_backup_*.dump s3://hms-backups/
   
   # Backup Kubernetes resources
   kubectl get all -A -o yaml > kubernetes_backup_$(date +%Y%m%d%H%M%S).yaml
   ```

3. **Create Deployment Directory**:
   ```bash
   mkdir -p deployments/$(date +%Y%m%d%H%M%S)
   cd deployments/$(date +%Y%m%d%H%M%S)
   ```

4. **Update Version Information**:
   ```bash
   # Update version information in ConfigMap
   kubectl create configmap hms-version --from-literal=version=<version> --from-literal=deployment-date=$(date -u +"%Y-%m-%dT%H:%M:%SZ") --dry-run=client -o yaml > version-configmap.yaml
   ```

### 2. Database Migration

1. **Apply Database Schema Changes**:
   ```bash
   # Create schema backup
   PGPASSWORD=<password> pg_dump -h <hostname> -U <username> -d <database> --schema-only -f schema_backup_$(date +%Y%m%d%H%M%S).sql
   
   # Apply migrations
   cd /workspace/Hospital-Management-System
   npm run migrate:prod
   ```

2. **Verify Database Migration**:
   ```bash
   # Run migration verification script
   npm run verify-migration
   ```

### 3. Deploy Infrastructure Components

1. **Deploy Secrets**:
   ```bash
   # Deploy secrets from Vault
   kubectl apply -f <(vault kv get -format=yaml secret/hms/production | yq e '.data.data | to_entries | map({"apiVersion": "v1", "kind": "Secret", "metadata": {"name": "hms-" + .key}, "type": "Opaque", "data": {(.key): (.value | @base64)}})' -)
   ```

2. **Deploy ConfigMaps**:
   ```bash
   kubectl apply -f kubernetes/configmaps/
   ```

3. **Deploy Redis**:
   ```bash
   helm upgrade --install redis bitnami/redis --values kubernetes/values/redis-values.yaml -n hms
   ```

4. **Deploy Supporting Services**:
   ```bash
   kubectl apply -f kubernetes/supporting-services/
   ```

### 4. Deploy Blue Environment

1. **Update Image Tags**:
   ```bash
   # Set environment variables
   export VERSION=<version>
   export DEPLOYMENT_ID=$(date +%Y%m%d%H%M%S)
   
   # Update image tags in Kubernetes manifests
   for service in "${SERVICES[@]}"; do
     case "$service" in
       "frontend-service")
         IMAGE_NAME="frontend"
         ;;
       *)
         IMAGE_NAME=$(echo $service | sed 's/-service//')
         ;;
     esac
     
     IMAGE_TAG="${REGISTRY}/${IMAGE_NAME}:${VERSION}-${DEPLOYMENT_ID}"
     
     # Update ArgoCD application
     argocd app set "hms-${service}" --kustomize-image="${IMAGE_TAG}"
   done
   ```

2. **Deploy Blue Environment**:
   ```bash
   # Deploy blue environment using ArgoCD
   for service in "${SERVICES[@]}"; do
     argocd app sync "hms-${service}"
   done
   ```

3. **Verify Blue Environment Deployment**:
   ```bash
   # Check deployment status
   for service in "${SERVICES[@]}"; do
     kubectl rollout status deployment/${service}-blue -n hms
   done
   ```

### 5. Blue Environment Testing

1. **Automated Smoke Tests**:
   ```bash
   # Run smoke tests against blue environment
   ENVIRONMENT=blue npm run test:smoke
   ```

2. **Health Check Validation**:
   ```bash
   # Check health endpoints
   for service in "${SERVICES[@]}"; do
     curl -s -o /dev/null -w "%{http_code}" https://${service}-blue.hms.internal/health
   done
   ```

3. **Manual Verification**:
   - Access the blue environment at https://blue.hms.health
   - Verify critical workflows
   - Check monitoring dashboards

### 6. Traffic Migration

1. **Start Traffic Migration**:
   ```bash
   # Update Istio VirtualService to route 10% of traffic to blue environment
   kubectl apply -f kubernetes/istio/virtualservice-blue-10.yaml
   ```

2. **Monitor for Issues**:
   ```bash
   # Monitor error rates
   watch "curl -s https://prometheus.hms.internal/api/v1/query?query=sum(rate(http_server_requests_seconds_count{status=~'5..'}[1m]))/sum(rate(http_server_requests_seconds_count[1m]))"
   ```

3. **Incremental Traffic Shift**:
   ```bash
   # Shift 50% of traffic to blue environment
   kubectl apply -f kubernetes/istio/virtualservice-blue-50.yaml
   
   # Wait and monitor
   sleep 300
   
   # Shift 100% of traffic to blue environment
   kubectl apply -f kubernetes/istio/virtualservice-blue-100.yaml
   ```

4. **Verify Complete Migration**:
   ```bash
   # Verify traffic routing
   istioctl proxy-config route $(kubectl get pod -l app=istio-ingressgateway -n istio-system -o jsonpath='{.items[0].metadata.name}') -n istio-system
   ```

### 7. Post-Deployment Verification

1. **Run Full Verification Suite**:
   ```bash
   # Run verification suite
   npm run verify:production
   ```

2. **Verify Monitoring**:
   ```bash
   # Check Prometheus targets
   curl -s https://prometheus.hms.internal/api/v1/targets | jq '.data.activeTargets[] | select(.health == "down")'
   ```

3. **Verify Logs**:
   ```bash
   # Check for error logs
   curl -s -X POST "https://elasticsearch.hms.internal/_search" -H 'Content-Type: application/json' -d'
   {
     "query": {
       "bool": {
         "must": [
           { "match": { "level": "error" } },
           { "range": { "@timestamp": { "gte": "now-1h" } } }
         ]
       }
     }
   }' | jq '.hits.total.value'
   ```

### 8. Cleanup

1. **Keep Green Environment as Fallback**:
   ```bash
   # Scale down green environment to save resources
   for service in "${SERVICES[@]}"; do
     kubectl scale deployment/${service}-green --replicas=1 -n hms
   done
   ```

2. **Update Documentation**:
   ```bash
   # Update deployment history
   echo "- Deployment ID: ${DEPLOYMENT_ID}" >> /workspace/Hospital-Management-System/docs/deployment-history.md
   echo "  Date: $(date)" >> /workspace/Hospital-Management-System/docs/deployment-history.md
   echo "  Version: ${VERSION}" >> /workspace/Hospital-Management-System/docs/deployment-history.md
   echo "  Status: Successful" >> /workspace/Hospital-Management-System/docs/deployment-history.md
   echo "" >> /workspace/Hospital-Management-System/docs/deployment-history.md
   ```

3. **Notify Stakeholders**:
   ```bash
   # Send notification to Slack
   curl -X POST -H 'Content-type: application/json' --data '{
     "text": "HMS Production Deployment Completed Successfully\nVersion: '"${VERSION}"'\nDeployment ID: '"${DEPLOYMENT_ID}"'"
   }' $SLACK_WEBHOOK_URL
   ```

## Verification Procedures

### 1. Functional Verification

1. **Patient Registration**:
   - Register a new test patient
   - Verify patient information is saved correctly
   - Check audit logs for the registration event

2. **Appointment Scheduling**:
   - Schedule a new appointment for the test patient
   - Modify the appointment
   - Cancel the appointment
   - Verify all changes are reflected in the system

3. **Billing Process**:
   - Create a new invoice for the test patient
   - Add billing items
   - Process a payment
   - Generate a receipt
   - Verify all financial records are correct

4. **Clinical Workflows**:
   - Record vital signs for the test patient
   - Create a prescription
   - Order laboratory tests
   - Record test results
   - Verify all clinical data is saved correctly

### 2. Performance Verification

1. **Response Time Check**:
   ```bash
   # Check API response times
   curl -w "\nTime: %{time_total}\n" -s https://api.hms.health/health
   ```

2. **Load Test**:
   ```bash
   # Run short load test to verify performance
   npm run test:load:short
   ```

3. **Database Performance**:
   ```bash
   # Check database performance
   PGPASSWORD=<password> psql -h <hostname> -U <username> -d <database> -c "SELECT * FROM pg_stat_activity;"
   ```

4. **Cache Hit Rate**:
   ```bash
   # Check Redis cache hit rate
   redis-cli -h <hostname> -p <port> -a <password> info stats | grep hit_rate
   ```

### 3. Security Verification

1. **Vulnerability Scan**:
   ```bash
   # Run vulnerability scan
   npm run security:scan:prod
   ```

2. **SSL Certificate Check**:
   ```bash
   # Check SSL certificates
   curl -Ivs https://hms.health 2>&1 | grep "expire date"
   ```

3. **Authentication Check**:
   ```bash
   # Test authentication
   curl -s -o /dev/null -w "%{http_code}" https://api.hms.health/api/v1/patients -H "Authorization: Bearer $INVALID_TOKEN"
   ```

4. **Audit Log Check**:
   ```bash
   # Verify audit logs are being generated
   curl -s -X POST "https://elasticsearch.hms.internal/_search" -H 'Content-Type: application/json' -d'
   {
     "query": {
       "bool": {
         "must": [
           { "match": { "type": "audit" } },
           { "range": { "@timestamp": { "gte": "now-1h" } } }
         ]
       }
     }
   }' | jq '.hits.total.value'
   ```

## Rollback Process

If issues are detected during or after deployment, follow these steps to rollback to the previous version:

### 1. Rollback Decision

Evaluate the severity of the issue:
- **Critical Issues**: Proceed with immediate rollback
- **Non-Critical Issues**: Consider fixing forward if possible

### 2. Traffic Rollback

```bash
# Rollback traffic to green environment
kubectl apply -f kubernetes/istio/virtualservice-green-100.yaml
```

### 3. Database Rollback

```bash
# Rollback database changes
PGPASSWORD=<password> psql -h <hostname> -U <username> -d <database> -f database/rollback/rollback_to_$(cat previous_version.txt).sql
```

### 4. Service Rollback

```bash
# Rollback ArgoCD applications
for service in "${SERVICES[@]}"; do
  argocd app rollback "hms-${service}"
done
```

### 5. Verification After Rollback

```bash
# Verify system is functioning after rollback
npm run verify:smoke
```

### 6. Document Rollback

```bash
# Update deployment history
echo "- Deployment ID: ${DEPLOYMENT_ID}" >> /workspace/Hospital-Management-System/docs/deployment-history.md
echo "  Date: $(date)" >> /workspace/Hospital-Management-System/docs/deployment-history.md
echo "  Version: ${VERSION}" >> /workspace/Hospital-Management-System/docs/deployment-history.md
echo "  Status: Rolled Back" >> /workspace/Hospital-Management-System/docs/deployment-history.md
echo "  Reason: ${ROLLBACK_REASON}" >> /workspace/Hospital-Management-System/docs/deployment-history.md
echo "" >> /workspace/Hospital-Management-System/docs/deployment-history.md
```

## Troubleshooting

### Common Issues and Resolutions

1. **Database Connection Issues**:
   ```bash
   # Check database connectivity
   PGPASSWORD=<password> psql -h <hostname> -U <username> -d <database> -c "SELECT 1;"
   
   # Check database connection pool
   kubectl logs -l app=<service> -n hms | grep "connection"
   ```

2. **Pod Startup Failures**:
   ```bash
   # Check pod status
   kubectl get pods -n hms
   
   # Check pod logs
   kubectl logs <pod-name> -n hms
   
   # Check pod events
   kubectl describe pod <pod-name> -n hms
   ```

3. **Network Issues**:
   ```bash
   # Check network policies
   kubectl get networkpolicies -n hms
   
   # Check service connectivity
   kubectl exec -it <pod-name> -n hms -- curl -v <service-name>:80/health
   ```

4. **Resource Constraints**:
   ```bash
   # Check resource usage
   kubectl top nodes
   kubectl top pods -n hms
   
   # Check for pods evicted due to resource constraints
   kubectl get events -n hms | grep "Evicted"
   ```

## Post-Deployment Tasks

1. **Monitor System Health**:
   - Monitor system dashboards for 24 hours
   - Watch for any anomalies in metrics
   - Check error rates and response times

2. **Conduct Post-Deployment Review**:
   - Review deployment process
   - Identify areas for improvement
   - Document lessons learned

3. **Update Documentation**:
   - Update system documentation with new features
   - Update operational procedures if necessary
   - Update training materials for end users

4. **Provide User Support**:
   - Communicate deployment completion to users
   - Provide support for any questions or issues
   - Collect feedback on new features or changes

## Contact Information

For issues during deployment, contact:

- **Deployment Team**: deployment@hms.health
- **Database Team**: database@hms.health
- **Security Team**: security@hms.health
- **DevOps Engineer On-Call**: +1-555-123-4567
- **Project Manager**: +1-555-765-4321

## Appendices

### Appendix A: Service List

```bash
SERVICES=(
  "frontend-service"
  "api-gateway"
  "patient-service"
  "appointment-service" 
  "billing-service"
  "pharmacy-service"
  "laboratory-service"
  "analytics-service"
  "cdss-service"
  "auth-service"
)
```

### Appendix B: Environment Variables

```bash
# Registry information
REGISTRY="hms-registry.example.com"

# Version information
VERSION="2.5.0"
DEPLOYMENT_ID=$(date +%Y%m%d%H%M%S)

# Database information
DB_HOST="hms-db.production.svc.cluster.local"
DB_PORT="5432"
DB_NAME="hms"
DB_USER="hms_admin"

# Redis information
REDIS_HOST="redis-master.hms.svc.cluster.local"
REDIS_PORT="6379"

# Notification endpoints
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX"
```

### Appendix C: Deployment Checklist

- [ ] Prerequisites validated
- [ ] Database backed up
- [ ] Kubernetes resources backed up
- [ ] Database migrations applied and verified
- [ ] Secrets and ConfigMaps deployed
- [ ] Supporting services deployed
- [ ] Blue environment deployed
- [ ] Smoke tests passed
- [ ] Health checks validated
- [ ] Manual verification completed
- [ ] Traffic migration started
- [ ] Monitoring during migration
- [ ] Traffic migration completed
- [ ] Full verification suite passed
- [ ] Monitoring verified
- [ ] Logs verified
- [ ] Green environment scaled down
- [ ] Documentation updated
- [ ] Stakeholders notified

### Appendix D: Rollback Checklist

- [ ] Rollback decision made
- [ ] Traffic rolled back to green environment
- [ ] Database rolled back
- [ ] Services rolled back
- [ ] Verification after rollback
- [ ] Rollback documented
- [ ] Stakeholders notified of rollback