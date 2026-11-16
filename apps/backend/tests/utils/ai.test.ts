import { describe, expect, it } from 'vitest';

import type { TokenUsage } from '../../src/types/chat';
import type { CustomModelMetadata } from '../../src/types/llm';
import { convertToCost } from '../../src/utils/ai';

describe('convertToCost', () => {
	const usage: TokenUsage = {
		inputTotalTokens: 1_000_000,
		inputNoCacheTokens: 1_000_000,
		inputCacheReadTokens: 0,
		inputCacheWriteTokens: 0,
		outputTotalTokens: 1_000_000,
		outputTextTokens: 1_000_000,
		outputReasoningTokens: 0,
		totalTokens: 2_000_000,
	};
	const declaredOutput: CustomModelMetadata[] = [{ id: 'eu.anthropic.claude-sonnet-5-5', costPerM: { output: 20 } }];

	it.each([
		{ modelId: 'eu.anthropic.claude-sonnet-5-5', customModels: [], totalCost: 12 },
		{ modelId: 'eu.anthropic.claude-sonnet-5-5', customModels: declaredOutput, totalCost: 22 },
		{ modelId: 'eu.anthropic.claude-future-9', customModels: [], totalCost: undefined },
	])(
		'prices Bedrock $modelId from its listed twin, declared costs first ($totalCost)',
		({ modelId, customModels, totalCost }) => {
			expect(convertToCost(usage, 'bedrock', modelId, customModels).totalCost).toBe(totalCost);
		},
	);
});
