import { parse } from '../parser/index';
import type { ParseResult, HypothesisRegister } from '../model/types';

export type LoadError =
  | { _tag: 'FileNotFound'; path: string }
  | { _tag: 'FileReadError'; path: string; reason: string }
  | { _tag: 'EmptyFile'; path: string };

export type LoadResult =
  | { _tag: 'Ok'; data: ParseResult }
  | { _tag: 'Err'; error: LoadError };

/**
 * Loads and parses the hypothesis register from a markdown file.
 */
export async function loadRegister(path: string): Promise<LoadResult> {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      if (response.status === 404) {
        return { _tag: 'Err', error: { _tag: 'FileNotFound', path } };
      }
      return { _tag: 'Err', error: { _tag: 'FileReadError', path, reason: `HTTP ${response.status}` } };
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      return { _tag: 'Err', error: { _tag: 'EmptyFile', path } };
    }

    // If the path ends in .json, try to parse as pre-computed JSON
    if (path.endsWith('.json')) {
      return loadFromJson(text, path);
    }

    const result = parse(text);
    return { _tag: 'Ok', data: result };
  } catch (err) {
    return {
      _tag: 'Err',
      error: {
        _tag: 'FileReadError',
        path,
        reason: err instanceof Error ? err.message : 'Unknown error',
      },
    };
  }
}

/**
 * Parse pre-computed JSON register into a ParseResult.
 * The JSON should match the HypothesisRegister interface.
 */
function loadFromJson(text: string, path: string): LoadResult {
  try {
    const data = JSON.parse(text);

    // If the JSON is already a full ParseResult (has register + warnings + parseCompleteness)
    if (data.register && data.warnings !== undefined && data.parseCompleteness !== undefined) {
      return { _tag: 'Ok', data: data as ParseResult };
    }

    // If the JSON is a raw HypothesisRegister, wrap it in a ParseResult
    if (data.metadata && data.hypotheses) {
      const register = data as HypothesisRegister;
      return {
        _tag: 'Ok',
        data: {
          register,
          warnings: [],
          parseCompleteness: 1.0,
        },
      };
    }

    return {
      _tag: 'Err',
      error: { _tag: 'FileReadError', path, reason: 'JSON does not match expected schema' },
    };
  } catch (err) {
    return {
      _tag: 'Err',
      error: {
        _tag: 'FileReadError',
        path,
        reason: `Invalid JSON: ${err instanceof Error ? err.message : 'parse error'}`,
      },
    };
  }
}

/**
 * Parse from a string directly (for testing or inline data).
 */
export function loadRegisterFromString(markdown: string): LoadResult {
  if (!markdown || markdown.trim().length === 0) {
    return { _tag: 'Err', error: { _tag: 'EmptyFile', path: '(inline)' } };
  }

  const result = parse(markdown);
  return { _tag: 'Ok', data: result };
}
