/**
 * Q-Static logger stub.
 * Provides minimal logging interface for ported components.
 */
export const logger = {
	info: (...args: unknown[]) => console.log('[Q-Static]', ...args),
	warn: (...args: unknown[]) => console.warn('[Q-Static]', ...args),
	error: (...args: unknown[]) => console.error('[Q-Static]', ...args),
	debug: (...args: unknown[]) => console.debug('[Q-Static]', ...args)
};
