export type ValidationLevel = 'error' | 'warning';

export interface ValidationResult {
  level: ValidationLevel;
  message: string;
  field?: string;
}

/**
 * Pure validation for common template data shapes.
 * Returns structured results instead of printing, so callers (CLI, pipelines)
 * can decide how to present them.
 */
export function validateTemplateData(data: unknown): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (data == null || typeof data !== 'object') {
    results.push({
      level: 'error',
      message: 'template data must be a non-null object',
    });
    return results;
  }

  const d = data as Record<string, unknown>;

  if (typeof d.title !== 'string' || d.title.trim() === '') {
    results.push({
      level: 'error',
      field: 'title',
      message: 'title is required and must be a non-empty string',
    });
  }

  if (d.preview != null && typeof d.preview !== 'string') {
    results.push({
      level: 'warning',
      field: 'preview',
      message: 'preview should be a string when present',
    });
  }

  if (d.bodyContent != null && typeof d.bodyContent !== 'string') {
    results.push({
      level: 'error',
      field: 'bodyContent',
      message: 'bodyContent must be a string when present',
    });
  }

  return results;
}

/** True when any result has level === 'error'. */
export function hasErrors(results: readonly ValidationResult[]): boolean {
  return results.some((r) => r.level === 'error');
}
