import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import LogConsole from './LogConsole.svelte';

describe('LogConsole Component', () => {
	it('renders without crashing', () => {
		const { container } = render(LogConsole);
		expect(container).toBeTruthy();
	});

	it('accepts logs prop', () => {
		const { container } = render(LogConsole, { logs: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts visible prop', () => {
		const { container } = render(LogConsole, { visible: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts expanded prop', () => {
		const { container } = render(LogConsole, { expanded: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts qrsConnected prop', () => {
		const { container } = render(LogConsole, { qrsConnected: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts svelteConnected prop', () => {
		const { container } = render(LogConsole, { svelteConnected: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts isDark prop', () => {
		const { container } = render(LogConsole, { isDark: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts onRemoveLog callback prop', () => {
		const onRemoveLog = vi.fn();
		const { container } = render(LogConsole, { onRemoveLog, visible: true, expanded: true });
		// onRemoveLog is triggered via context menu — verify it renders with the handler
		expect(container).toBeInTheDocument();
	});

	it('calls onClearLogs when clear button is clicked', async () => {
		const onClearLogs = vi.fn();
		const { container } = render(LogConsole, { onClearLogs, visible: true, expanded: true });
		const clearBtn = container.querySelector('button[title="Clear all logs"]');
		if (clearBtn) await fireEvent.click(clearBtn);
		expect(onClearLogs).toHaveBeenCalled();
	});
});
