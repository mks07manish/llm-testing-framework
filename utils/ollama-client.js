
export async function askOllama(request, prompt) {
  const response = await request.post(
    'http://localhost:11434/api/chat',
    {
      data: {
        model: 'llama3.2:1b',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: false,
        options: {
          temperature: 0,
        },
      },
      timeout: 120000,
    }
  );

  if (!response.ok()) {
    throw new Error(
      `Ollama API failed: HTTP ${response.status()}`
    );
  }

  const body = await response.json();
  const answer = body.message?.content?.trim();

  if (!answer) {
    throw new Error('Ollama returned an empty answer');
  }

  return answer;
}
