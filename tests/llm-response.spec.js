import { test, expect } from '@playwright/test';
import { askOllama } from '../utils/ollama-client.js';
import { evaluateResponse } from '../utils/response-evaluator.js';
import { llmTestCases } from '../data/llm-test-cases.js';

for (const testCase of llmTestCases) {
  test(`${testCase.id}: ${testCase.prompt}`, async ({ request }) => {
    const answer = await askOllama(request, testCase.prompt);

    console.log(`${testCase.id} answer:`, answer);

    const result = evaluateResponse(
      answer,
      testCase.expectedKeywords
    );

    expect(result.nonEmpty).toBe(true);
    expect(result.missingKeywords).toEqual([]);
  });
}
