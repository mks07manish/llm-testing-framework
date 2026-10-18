import { test, expect } from '@playwright/test';
import { scoreResponse } from '../utils/response-evaluator.js';

test('should award full score to a valid response', async () => {
  const result = scoreResponse(
    'Paris is the capital of France.',
    ['Paris', 'France'],
    100
  );

  expect(result.score).toBe(100);
  expect(result.nonEmpty).toBe(true);
  expect(result.missingKeywords).toEqual([]);
  expect(result.withinLengthLimit).toBe(true);
});

test('should deduct points for missing keywords', async () => {
  const result = scoreResponse(
    'Paris is a city.',
    ['Paris', 'France'],
    100
  );

  expect(result.score).toBe(80);
  expect(result.missingKeywords).toEqual(['France']);
});

test('should deduct points when response exceeds length limit', async () => {
  const result = scoreResponse(
    'Paris '.repeat(20),
    ['Paris'],
    50
  );

  expect(result.withinLengthLimit).toBe(false);
  expect(result.score).toBe(70);
});
