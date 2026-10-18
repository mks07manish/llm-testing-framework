import { test, expect } from '@playwright/test';
import { performance } from 'node:perf_hooks';
import { askOllama } from '../utils/ollama-client.js';
import { evaluateResponse } from '../utils/response-evaluator.js';

test('LLM should consistently answer a factual question', async ({ request }) => {
  const runs = [];

  for (let i = 1; i <= 5; i++) {
    const start = performance.now();

    const answer = await askOllama(
      request,
      'What is the capital of France? Answer briefly.'
    );

    const latencyMs = Math.round(performance.now() - start);

    const evaluation = evaluateResponse(answer, ['Paris']);

    runs.push({
      run: i,
      passed: evaluation.missingKeywords.length === 0,
      latencyMs,
      answer,
    });
  }

  console.log('Reliability results:', JSON.stringify(runs, null, 2));

  // Every run must contain the expected factual keyword.
  expect(runs.filter(run => run.passed)).toHaveLength(5);

  // Basic latency sanity check, not a performance SLA.
  expect(runs.every(run => run.latencyMs > 0)).toBe(true);
});
