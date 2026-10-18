import { writeFile } from 'node:fs/promises';
export class LLMMetrics {
    constructor() {
        this.results = [];
    }

    recordResult({ testId, passed, latencyMs }) {
        this.results.push({
            testId,
            passed,
            latencyMs,
        });
    }

    getSummary() {
        const total = this.results.length;
        const passed = this.results.filter(result => result.passed).length;
        const failed = total - passed;

        const averageLatencyMs =
            total === 0
                ? 0
                : this.results.reduce(
                    (sum, result) => sum + result.latencyMs,
                    0
                ) / total;

        return {
            total,
            passed,
            failed,
            passPercentage:
                total === 0 ? 0 : Number(((passed / total) * 100).toFixed(2)),
            averageLatencyMs: Number(averageLatencyMs.toFixed(2)),
        };
    }
}


export async function saveMetricsReport(summary, filePath) {
    await writeFile(
        filePath,
        JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                ...summary,
            },
            null,
            2
        ),
        'utf8'
    );
}


