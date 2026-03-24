export interface TerminalTab {
	label: string;
	count?: number;
}

export interface TerminalLine {
	type: 'prompt' | 'info' | 'success' | 'error';
	text: string;
}
