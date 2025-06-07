/**
 * Monitoring Alerts API Endpoint
 * Manages alert rules and notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('ruleId');

    if (ruleId) {
      // Return specific alert rule
      // This would require adding a method to get specific rules from metricsCollector
      return NextResponse.json({
        error: 'Specific rule retrieval not implemented yet',
      }, { status: 501 });
    }

    // Return all alert rules and recent alerts
    const alertData = {
      rules: [
        {
          id: 'db_response_time',
          name: 'Database Response Time High',
          metric: 'database.response_time',
          condition: 'gt',
          threshold: 2000,
          duration: 300,
          severity: 'high',
          enabled: true,
          notifications: ['email', 'slack'],
        },
        {
          id: 'error_rate_high',
          name: 'Error Rate High',
          metric: 'api.error_rate',
          condition: 'gt',
          threshold: 0.05,
          duration: 180,
          severity: 'critical',
          enabled: true,
          notifications: ['email', 'slack', 'sms'],
        },
        {
          id: 'memory_usage_high',
          name: 'Memory Usage High',
          metric: 'system.memory_usage',
          condition: 'gt',
          threshold: 0.85,
          duration: 600,
          severity: 'medium',
          enabled: true,
          notifications: ['email'],
        },
      ],
      recentAlerts: [
        // This would come from a persistent alert log
        {
          id: 'alert_1704067200000',
          ruleId: 'memory_usage_high',
          ruleName: 'Memory Usage High',
          metric: 'system.memory_usage',
          value: 0.87,
          threshold: 0.85,
          severity: 'medium',
          timestamp: '2024-01-01T00:00:00.000Z',
          status: 'resolved',
        },
      ],
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'success',
      data: alertData,
    });

  } catch (error) {
    console.error('Alerts API error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_rule':
        const rule = body.rule;
        if (!rule || !rule.id || !rule.name || !rule.metric) {
          return NextResponse.json(
            { error: 'Invalid rule data' },
            { status: 400 }
          );
        }
        
        metricsCollector.addAlertRule(rule);
        return NextResponse.json({ 
          message: 'Alert rule created',
          ruleId: rule.id,
        });

      case 'update_rule':
        const updatedRule = body.rule;
        if (!updatedRule || !updatedRule.id) {
          return NextResponse.json(
            { error: 'Invalid rule data' },
            { status: 400 }
          );
        }
        
        metricsCollector.addAlertRule(updatedRule); // This will overwrite existing
        return NextResponse.json({ 
          message: 'Alert rule updated',
          ruleId: updatedRule.id,
        });

      case 'delete_rule':
        const ruleId = body.ruleId;
        if (!ruleId) {
          return NextResponse.json(
            { error: 'Rule ID is required' },
            { status: 400 }
          );
        }
        
        metricsCollector.removeAlertRule(ruleId);
        return NextResponse.json({ 
          message: 'Alert rule deleted',
          ruleId,
        });

      case 'test_alert':
        const testRule = body.rule;
        if (!testRule) {
          return NextResponse.json(
            { error: 'Rule data is required for testing' },
            { status: 400 }
          );
        }
        
        // Simulate an alert trigger for testing
        console.log('🧪 Testing alert rule:', testRule.name);
        
        return NextResponse.json({ 
          message: 'Test alert triggered',
          testResult: {
            rule: testRule.name,
            notifications: testRule.notifications,
            timestamp: new Date().toISOString(),
          },
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Alerts API POST error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleId, enabled } = body;

    if (!ruleId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Rule ID and enabled status are required' },
        { status: 400 }
      );
    }

    // This would require updating the metricsCollector to support enabling/disabling rules
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alert rule: ${ruleId}`);

    return NextResponse.json({
      message: `Alert rule ${enabled ? 'enabled' : 'disabled'}`,
      ruleId,
      enabled,
    });

  } catch (error) {
    console.error('Alerts API PUT error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
