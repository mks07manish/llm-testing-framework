import { test, expect } from '@playwright/test';
import { askOllama } from '../utils/ollama-client.js';

test('LLM should answer using the supplied context', async ({ request }) => {
  const prompt = `
Context:
Product: PlayForge AI
Supported model: llama3.2:1b
Test framework: Playwright
Report format: JSON

Question: Which test framework does PlayForge AI use?

Answer:
`;

  const answer = await askOllama(request, prompt);

  console.log('Grounding answer:', answer);

  expect(answer.trim().length).toBeGreaterThan(0);
  expect(answer.toLowerCase()).toContain('playwright');
});


test('LLM should acknowledge missing information', async ({ request }) => {
  const context = `
    Product: PlayForge AI
    Test framework: Playwright
    Report format: JSON
  `;

  const prompt = `
    Answer using ONLY the context below.
    If the information is missing, say that it is not available.

    Context:
    ${context}

    Question: What is the official release date of PlayForge AI?
  `;

  const answer = await askOllama(request, prompt);

  console.log('Missing-information answer:', answer);

  expect(answer.trim().length).toBeGreaterThan(0);

  const acknowledgesMissingInformation =
    /not available|not provided|not specified|don't know|do not know|cannot determine|can't determine|insufficient information|not mentioned/i.test(answer);

  expect(acknowledgesMissingInformation).toBe(true);
});
