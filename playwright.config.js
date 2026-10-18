import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['list'],
    [
      'json',
      {
        outputFile: 'reports/llm-test-report.json',
      },
    ],
  ],

  timeout: 150000,

  workers: 1,
});
