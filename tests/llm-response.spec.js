import { test, expect } from '@playwright/test';
import { askOllama } from '../utils/ollama-client.js';
import { evaluateResponse } from '../utils/response-evaluator.js';
import { llmTestCases } from '../data/llm-test-cases.js';
import { scoreResponse } from '../utils/response-evaluator.js';
import { saveMetricsReport } from '../utils/llm-metrics.js';

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

        const evaluation = scoreResponse(
            answer,
            testCase.expectedKeywords,
            500
        );

        console.log(`${testCase.id} quality score:`, evaluation);
        expect(evaluation.nonEmpty).toBe(true);
        expect(evaluation.missingKeywords).toEqual([]);
        expect(evaluation.withinLengthLimit).toBe(true);
        expect(evaluation.score).toBeGreaterThanOrEqual(70);

        await saveMetricsReport(
            {
                total: 1,
                passed: evaluation.missingKeywords.length === 0 ? 1 : 0,
                failed: evaluation.missingKeywords.length === 0 ? 0 : 1,
                passPercentage:
                    evaluation.missingKeywords.length === 0 ? 100 : 0,
                averageLatencyMs: 0,
            },
            `reports/${testCase.id}-quality.json`,
            [
                {
                    testId: testCase.id,
                    score: evaluation.score,
                    missingKeywords: evaluation.missingKeywords,
                },
            ]
        );
    });
}


