import { test, expect } from '@playwright/test';
import { askOllama } from '../utils/ollama-client.js';
import { parseJsonResponse } from '../utils/response-evaluator.js';

test('LLM should return valid JSON when requested', async ({ request }) => {
  const answer = await askOllama(
    request,
    `Return only a valid JSON object with these fields:
     "name": "Paris" and "country": "France".
     Do not include Markdown or explanations.`
  );

  console.log('JSON response:', answer);

  const result = parseJsonResponse(answer);

  expect(result.valid).toBe(true);
  expect(result.data).toHaveProperty('name', 'Paris');
  expect(result.data).toHaveProperty('country', 'France');
});


// test('LLM should follow a three-bullet instruction', async ({ request }) => {
//   const answer = await askOllama(
//     request,
//     'Give exactly three bullet points about software testing. Each point must begin with "- ".'
//   );

//   console.log('Formatted response:', answer);

//   const bullets = answer
//     .split('\n')
//     .map(line => line.trim())
//     .filter(line => line.startsWith('- .'));

//   expect(bullets).toHaveLength(3);
// });


test('LLM should follow a three-bullet instructions', async ({ request }) => {
  const answer = await askOllama(
    request,
    `Explain three benefits of software testing.
Return exactly three lines.
Each line must start with "- " (hyphen and space).
Do not include an introduction, conclusion, Markdown formatting,
or any other bullet character.`
  );

  console.log('Formatted response:', answer);

  const lines = answer
    .trim()
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  console.log('Parsed lines:', lines);

  expect(lines).toHaveLength(3);

  for (const line of lines) {
    expect(line).toMatch(/^- \S/);
  }
});