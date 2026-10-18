import 'dotenv/config';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

export async function askOllama(request, prompt) {

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
        throw new Error('Prompt must be a non-empty string');
    }
    const response = await request.post(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
            data: {
                model: OLLAMA_MODEL,
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
