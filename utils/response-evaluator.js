
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
