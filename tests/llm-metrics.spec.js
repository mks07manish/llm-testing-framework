
import { test, expect } from '@playwright/test';
import { LLMMetrics } from '../utils/llm-metrics.js';

test('should calculate LLM execution metrics correctly', async () => {
  const metrics = new LLMMetrics();

  metrics.recordResult({
    testId: 'LLM-001',
    passed: true,
    latencyMs: 100,
  });

  metrics.recordResult({
    testId: 'LLM-002',
    passed: true,
    latencyMs: 200,
  });

  metrics.recordResult({
    testId: 'LLM-003',
    passed: false,
    latencyMs: 300,
  });

  const summary = metrics.getSummary();

  expect(summary.total).toBe(3);
  expect(summary.passed).toBe(2);
  expect(summary.failed).toBe(1);
  expect(summary.passPercentage).toBe(66.67);
  expect(summary.averageLatencyMs).toBe(200);
});
