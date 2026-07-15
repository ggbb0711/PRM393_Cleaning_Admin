import { describe, expect, it } from 'vitest';
import { cleanAiColors } from './tokens';
import { cleanAiTheme } from './theme';

describe('CleanAI theme', () => {
  it('[UT-WEB-FOUNDATION-001-01] sử dụng đúng bảng màu của ứng dụng CleanAI', () => {
    expect(cleanAiTheme.palette.primary.main).toBe(cleanAiColors.primary);
    expect(cleanAiTheme.palette.secondary.main).toBe(cleanAiColors.secondary);
    expect(cleanAiTheme.palette.warning.main).toBe(cleanAiColors.tertiary);
    expect(cleanAiTheme.palette.error.main).toBe(cleanAiColors.error);
  });
});
