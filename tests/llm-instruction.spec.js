import { test, expect } from '@playwright/test';
import { askOllama } from '../utils/ollama-client.js';

test('LLM should follow the requested response format', async ({ request }) => {
  const prompt = `
  Explain API testing in exactly three points.
  Each point must start with "- ".
  Do not write an introduction or conclusion
  or any other bullet character.
  `;

  const answer = await askOllama(request, prompt);

  console.log('Instruction-following answer:\n', answer);

  const bulletPoints = answer
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '));

  expect(bulletPoints).toHaveLength(3);
});

test('LLM should stay relevant to the question', async ({ request }) => {
  const prompt = `
  What is API testing?
  Answer in one or two sentences.
  `;

  const answer = await askOllama(request, prompt);

  console.log('Relevance answer:', answer);

  expect(answer.trim().length).toBeGreaterThan(0);
  expect(answer.length).toBeLessThan(500);
  expect(answer.toLowerCase()).toMatch(/api|application programming interface/);
});
