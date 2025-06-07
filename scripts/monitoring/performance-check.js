#!/usr/bin/env node

/**
 * Enterprise Performance Monitoring Script for HMS
 * Monitors application performance, API response times, and system health
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3000',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      thresholds: {
        responseTime: config.responseTimeThreshold || 2000,
        uptime: config.uptimeThreshold || 99.5,
        errorRate: config.errorRateThreshold || 1.0,
        ...config.thresholds
      },
      endpoints: [
        { path: '/', name: 'Homepage', critical: true },
        { path: '/api/health', name: 'Health Check', critical: true },
        { path: '/api/patients', name: 'Patients API', critical: true },
        { path: '/api/appointments', name: 'Appointments API', critical: true },
        { path: '/api/fhir/Patient', name: 'FHIR Patient API', critical: true },
        { path: '/dashboard', name: 'Dashboard', critical: false },
        { path: '/login', name: 'Login Page', critical: false },
        ...config.endpoints || []
      ],
      ...config
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      overall: {
        passed: false,
        score: 0,
        duration: 0
      },
      endpoints: [],
      metrics: {
        averageResponseTime: 0,
        successRate: 0,
        errorCount: 0,
        totalRequests: 0
      },
      alerts: []
    };
  }

  async checkEndpoint(endpoint) {
    const startTime = performance.now();
    const url = `${this.config.baseUrl}${endpoint.path}`;
    
    try {
      const response = await this.makeRequest(url);
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const result = {
        name: endpoint.name,
        path: endpoint.path,
        url,
        critical: endpoint.critical,
        status: 'success',
        statusCode: response.statusCode,
        responseTime: Math.round(responseTime),
        contentLength: response.contentLength || 0,
        headers: response.headers,
        passed: response.statusCode >= 200 && response.statusCode < 400 && responseTime < this.config.thresholds.responseTime,
        timestamp: new Date().toISOString()
      };
      
      // Additional checks for healthcare-specific endpoints
      if (endpoint.path.includes('/api/fhir/')) {
        result.fhirCompliant = this.validateFHIRResponse(response.body);
      }
      
      if (endpoint.path.includes('/api/')) {
        result.apiResponseValid = this.validateAPIResponse(response.body);
      }
      
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      return {
        name: endpoint.name,
        path: endpoint.path,
        url,
        critical: endpoint.critical,
        status: 'error',
        statusCode: 0,
        responseTime: Math.round(responseTime),
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: this.config.timeout,
        headers: {
          'User-Agent': 'HMS-Performance-Monitor/1.0',
          'Accept': 'application/json, text/html',
          'X-Performance-Check': 'true'
        }
      };
      
      const protocol = urlObj.protocol === 'https:' ? https : http;
      
      const req = protocol.request(options, (res) => {
        let body = '';
        let contentLength = 0;
        
        res.on('data', (chunk) => {
          body += chunk;
          contentLength += chunk.length;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
            contentLength
          });
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.config.timeout}ms`));
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.end();
    });
  }

  validateFHIRResponse(body) {
    try {
      const data = JSON.parse(body);
      return data.resourceType && data.resourceType.length > 0;
    } catch {
      return false;
    }
  }

  validateAPIResponse(body) {
    try {
      const data = JSON.parse(body);
      return typeof data === 'object' && data !== null;
    } catch {
      return false;
    }
  }

  async checkSystemMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      version: process.version,
      platform: process.platform
    };
    
    // Check if we can get additional system metrics
    try {
      const os = require('os');
      metrics.system = {
        cpus: os.cpus().length,
        loadAvg: os.loadavg(),
        freeMem: os.freemem(),
        totalMem: os.totalmem(),
        uptime: os.uptime()
      };
    } catch (error) {
      console.warn('Could not get system metrics:', error.message);
    }
    
    return metrics;
  }

  async runHealthChecks() {
    console.log('🏥 Starting HMS Performance Health Checks...');
    const startTime = performance.now();
    
    // Run endpoint checks
    const endpointPromises = this.config.endpoints.map(endpoint => 
      this.checkEndpoint(endpoint)
    );
    
    this.results.endpoints = await Promise.all(endpointPromises);
    
    // Calculate metrics
    const totalRequests = this.results.endpoints.length;
    const successfulRequests = this.results.endpoints.filter(r => r.passed).length;
    const errorCount = this.results.endpoints.filter(r => r.status === 'error').length;
    const averageResponseTime = this.results.endpoints.reduce((sum, r) => sum + r.responseTime, 0) / totalRequests;
    
    this.results.metrics = {
      averageResponseTime: Math.round(averageResponseTime),
      successRate: (successfulRequests / totalRequests) * 100,
      errorCount,
      totalRequests
    };
    
    // Check critical endpoints
    const criticalEndpoints = this.results.endpoints.filter(e => e.critical);
    const failedCriticalEndpoints = criticalEndpoints.filter(e => !e.passed);
    
    // Generate alerts
    this.generateAlerts();
    
    // Calculate overall score
    this.results.overall.score = this.calculateOverallScore();
    this.results.overall.passed = this.results.overall.score >= 80;
    this.results.overall.duration = Math.round(performance.now() - startTime);
    
    // Get system metrics
    this.results.systemMetrics = await this.checkSystemMetrics();
    
    console.log(`✅ Performance checks completed in ${this.results.overall.duration}ms`);
    console.log(`📊 Overall Score: ${this.results.overall.score}/100`);
    console.log(`📈 Success Rate: ${this.results.metrics.successRate.toFixed(2)}%`);
    console.log(`⚡ Average Response Time: ${this.results.metrics.averageResponseTime}ms`);
    
    return this.results;
  }

  generateAlerts() {
    this.results.alerts = [];
    
    // Check response time alerts
    const slowEndpoints = this.results.endpoints.filter(
      e => e.responseTime > this.config.thresholds.responseTime
    );
    
    slowEndpoints.forEach(endpoint => {
      this.results.alerts.push({
        type: 'performance',
        severity: endpoint.critical ? 'critical' : 'warning',
        message: `${endpoint.name} response time (${endpoint.responseTime}ms) exceeds threshold (${this.config.thresholds.responseTime}ms)`,
        endpoint: endpoint.name,
        value: endpoint.responseTime,
        threshold: this.config.thresholds.responseTime
      });
    });
    
    // Check error rate alerts
    if (this.results.metrics.errorCount > 0) {
      const errorRate = (this.results.metrics.errorCount / this.results.metrics.totalRequests) * 100;
      if (errorRate > this.config.thresholds.errorRate) {
        this.results.alerts.push({
          type: 'availability',
          severity: 'critical',
          message: `Error rate (${errorRate.toFixed(2)}%) exceeds threshold (${this.config.thresholds.errorRate}%)`,
          value: errorRate,
          threshold: this.config.thresholds.errorRate
        });
      }
    }
    
    // Check critical endpoint failures
    const failedCritical = this.results.endpoints.filter(e => e.critical && !e.passed);
    failedCritical.forEach(endpoint => {
      this.results.alerts.push({
        type: 'availability',
        severity: 'critical',
        message: `Critical endpoint ${endpoint.name} is failing`,
        endpoint: endpoint.name,
        statusCode: endpoint.statusCode,
        error: endpoint.error
      });
    });
  }

  calculateOverallScore() {
    let score = 100;
    
    // Deduct points for failed endpoints
    const failedEndpoints = this.results.endpoints.filter(e => !e.passed);
    const criticalFailures = failedEndpoints.filter(e => e.critical);
    const nonCriticalFailures = failedEndpoints.filter(e => !e.critical);
    
    score -= criticalFailures.length * 25; // 25 points per critical failure
    score -= nonCriticalFailures.length * 10; // 10 points per non-critical failure
    
    // Deduct points for slow response times
    const slowEndpoints = this.results.endpoints.filter(
      e => e.responseTime > this.config.thresholds.responseTime
    );
    score -= slowEndpoints.length * 5; // 5 points per slow endpoint
    
    // Bonus points for fast response times
    const fastEndpoints = this.results.endpoints.filter(
      e => e.passed && e.responseTime < this.config.thresholds.responseTime / 2
    );
    score += fastEndpoints.length * 2; // 2 bonus points per fast endpoint
    
    return Math.max(0, Math.min(100, score));
  }

  async saveReport(outputPath) {
    const reportData = {
      ...this.results,
      config: {
        baseUrl: this.config.baseUrl,
        thresholds: this.config.thresholds,
        endpoints: this.config.endpoints.map(e => ({ name: e.name, path: e.path, critical: e.critical }))
      }
    };
    
    await fs.writeFile(outputPath, JSON.stringify(reportData, null, 2));
    console.log(`📄 Performance report saved to ${outputPath}`);
  }

  async generateHTMLReport(outputPath) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HMS Performance Report - ${this.results.timestamp}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 3em; font-weight: bold; color: ${this.results.overall.passed ? '#28a745' : '#dc3545'}; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 1.5em; font-weight: bold; color: #007bff; }
        .endpoints { margin: 20px 0; }
        .endpoint { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; }
        .endpoint.passed { border-left: 4px solid #28a745; }
        .endpoint.failed { border-left: 4px solid #dc3545; }
        .endpoint.critical { font-weight: bold; }
        .alerts { margin: 20px 0; }
        .alert { padding: 10px; margin: 5px 0; border-radius: 5px; }
        .alert.critical { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .alert.warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .status { font-weight: bold; }
        .status.passed { color: #28a745; }
        .status.failed { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 HMS Performance Report</h1>
            <div class="score">${this.results.overall.score}/100</div>
            <p>Generated on ${new Date(this.results.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${this.results.metrics.successRate.toFixed(1)}%</div>
                <div>Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.metrics.averageResponseTime}ms</div>
                <div>Avg Response Time</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.metrics.errorCount}</div>
                <div>Errors</div>
            </div>
            <div class="metric">
                <div class="metric-value">${this.results.overall.duration}ms</div>
                <div>Test Duration</div>
            </div>
        </div>
        
        ${this.results.alerts.length > 0 ? `
        <div class="alerts">
            <h3>🚨 Alerts</h3>
            ${this.results.alerts.map(alert => `
                <div class="alert ${alert.severity}">
                    <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="endpoints">
            <h3>📡 Endpoint Results</h3>
            ${this.results.endpoints.map(endpoint => `
                <div class="endpoint ${endpoint.passed ? 'passed' : 'failed'} ${endpoint.critical ? 'critical' : ''}">
                    <div>
                        <strong>${endpoint.name}</strong>
                        ${endpoint.critical ? ' (Critical)' : ''}
                        <br>
                        <small>${endpoint.path}</small>
                    </div>
                    <div>
                        <span class="status ${endpoint.passed ? 'passed' : 'failed'}">
                            ${endpoint.passed ? '✅ PASS' : '❌ FAIL'}
                        </span>
                        <br>
                        <small>${endpoint.responseTime}ms | ${endpoint.statusCode}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
    `;
    
    await fs.writeFile(outputPath, html);
    console.log(`📄 HTML report saved to ${outputPath}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const config = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--base-url':
        config.baseUrl = args[++i];
        break;
      case '--timeout':
        config.timeout = parseInt(args[++i]);
        break;
      case '--response-time-threshold':
        config.responseTimeThreshold = parseInt(args[++i]);
        break;
      case '--json-report':
        config.jsonReport = args[++i];
        break;
      case '--html-report':
        config.htmlReport = args[++i];
        break;
      case '--fail-on-error':
        config.failOnError = true;
        break;
      case '--help':
        console.log(`
HMS Performance Monitor

Usage: node performance-check.js [options]

Options:
  --base-url <url>                  Base URL to test (default: http://localhost:3000)
  --timeout <ms>                   Request timeout in milliseconds (default: 30000)
  --response-time-threshold <ms>   Response time threshold (default: 2000)
  --json-report <path>             Save JSON report to path
  --html-report <path>             Save HTML report to path
  --fail-on-error                 Exit with error code if checks fail
  --help                          Show this help
        `);
        process.exit(0);
    }
  }
  
  try {
    const monitor = new PerformanceMonitor(config);
    const results = await monitor.runHealthChecks();
    
    // Save reports
    if (config.jsonReport) {
      await monitor.saveReport(config.jsonReport);
    }
    
    if (config.htmlReport) {
      await monitor.generateHTMLReport(config.htmlReport);
    }
    
    // Exit with appropriate code
    if (config.failOnError && !results.overall.passed) {
      console.error('❌ Performance checks failed');
      process.exit(1);
    } else {
      console.log('✅ Performance checks completed successfully');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 Performance check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { PerformanceMonitor };
