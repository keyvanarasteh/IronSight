export type LogLevel = 'info' | 'warning' | 'error' | 'success';
export type LogSource = 'all' | 'QRS' | 'SVELTE';

export interface LogEntry {
	id: string;
	timestamp: Date;
	level: LogLevel;
	message: string;
	stage?: string;
	details?: any;
	// Meta properties from QRS logger
	target?: string; // module path e.g. "qrs::api::handlers"
	file?: string; // source file
	line?: number; // line number
	// Network request/response info (for api calls)
	request?: {
		method: string;
		url: string;
		headers?: Record<string, string>;
		body?: any;
	};
	response?: {
		status: number;
		statusText?: string;
		headers?: Record<string, string>;
		body?: any;
		duration?: number;
	};
}
