
import { test, expect } from '@playwright/test';
import { performance } from 'node:perf_hooks';
import { askOllama } from '../utils/ollama-client.js';
import { LLMMetrics,saveMetricsReport } from '../utils/llm-metrics.js';

test('LLM reliability and execution metrics', async ({ request }) => {
  const metrics = new LLMMetrics();
  const iterations = 5;

  for (let i = 1; i <= iterations; i++) {
    const startTime = performance.now();
    let passed = false;
    let answer = '';

    try {
      answer = await askOllama(
        request,
        'What is the capital of France? Answer briefly.'
      );

      passed = answer.toLowerCase().includes('paris');
    } catch (error) {
      console.log(`Run ${i} error:`, error.message);
    }

    const latencyMs = Number(
      (performance.now() - startTime).toFixed(2)
    );

    metrics.recordResult({
      testId: `LLM-${String(i).padStart(3, '0')}`,
      passed,
      latencyMs,
    });

    console.log({
      run: i,
      passed,
      latencyMs,
      answer,
    });
  }

  const summary = metrics.getSummary();

  await saveMetricsReport(summary, 'reports/llm-metrics.json' );

  console.log('LLM Execution Metrics:', summary);

  expect(summary.total).toBe(iterations);
  expect(summary.passed).toBe(iterations);
  expect(summary.failed).toBe(0);
  expect(summary.passPercentage).toBe(100);
  expect(summary.averageLatencyMs).toBeGreaterThan(0);
});
