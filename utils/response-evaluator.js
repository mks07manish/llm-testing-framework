
export function evaluateResponse(answer, expectedKeywords = []) {
    const normalizedAnswer = answer.toLowerCase();

    return {
        nonEmpty: answer.trim().length > 0,

        matchedKeywords: expectedKeywords.filter(
            keyword =>
                normalizedAnswer.includes(keyword.toLowerCase())
        ),

        missingKeywords: expectedKeywords.filter(
            keyword =>
                !normalizedAnswer.includes(keyword.toLowerCase())
        ),
    };
}

export function parseJsonResponse(answer) {
    const cleaned = answer
        .trim()
        .replace(/^```(?:json)?[ \t]*\r?\n?/i, '')
        .replace(/\r?\n?```[ \t]*$/, '')
        .trim();

    try {
        return {
            valid: true,
            data: JSON.parse(cleaned),
        };
    } catch {
        return {
            valid: false,
            data: null,
        };
    }
}


export function scoreResponse(
    answer,
    expectedKeywords = [],
    maxLength = 500
) {
    const nonEmpty =
        typeof answer === 'string' && answer.trim().length > 0;

    const matchedKeywords = expectedKeywords.filter(keyword =>
        answer.toLowerCase().includes(keyword.toLowerCase())
    );

    const keywordScore =
        expectedKeywords.length === 0
            ? 40
            : (matchedKeywords.length / expectedKeywords.length) * 40;

    const lengthScore =
        nonEmpty && answer.length <= maxLength ? 30 : 0;

    const score =
        (nonEmpty ? 30 : 0) + keywordScore + lengthScore;

    return {
        score: Math.round(score),
        nonEmpty,
        matchedKeywords,
        missingKeywords: expectedKeywords.filter(
            keyword => !matchedKeywords.includes(keyword)
        ),
        withinLengthLimit: nonEmpty && answer.length <= maxLength,
    };
}
