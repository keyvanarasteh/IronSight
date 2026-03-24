import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Terminal from './Terminal.svelte';
import type { TerminalTab, TerminalLine } from '../../types';

describe('Terminal', () => {
	const tabs: TerminalTab[] = [{ label: 'TERMINAL' }, { label: 'PROBLEMS', count: 2 }];

	const output: TerminalLine[] = [
		{ type: 'prompt', text: 'npm run dev' },
		{ type: 'success', text: 'Compiled successfully' },
		{ type: 'error', text: 'Failed to compile' }
	];

	const props = {
		isOpen: true,
		onClose: vi.fn(),
		tabs,
		activeTerminalTab: 'TERMINAL',
		onTabChange: vi.fn(),
		output
	};

	it('renders tabs', () => {
		const { getByText } = render(Terminal, props);
		expect(getByText('TERMINAL')).toBeInTheDocument();
		expect(getByText('PROBLEMS')).toBeInTheDocument();
		expect(getByText('2')).toBeInTheDocument();
	});

	it('renders console output', () => {
		const { getByText } = render(Terminal, props);
		expect(getByText('npm run dev')).toBeInTheDocument();
		expect(getByText('Compiled successfully')).toHaveClass('text-green-500');
		expect(getByText('Failed to compile')).toHaveClass('text-destructive');
	});

	it('handles close click', async () => {
		const { getByLabelText } = render(Terminal, props);
		const closeBtn = getByLabelText('Close Terminal');
		expect(closeBtn).toBeDefined();
		await fireEvent.click(closeBtn);
		expect(props.onClose).toHaveBeenCalledOnce();
	});

	it('hides when closed', () => {
		const { container } = render(Terminal, { ...props, isOpen: false });
		const section = container.querySelector('section');
		expect(section).toBeTruthy();
		expect(section!).toHaveClass('h-0');
	});

	it('accepts tabs prop', () => {
		const { container } = render(Terminal, { tabs: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts activeTerminalTab prop', () => {
		const { container } = render(Terminal, { activeTerminalTab: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts output prop', () => {
		const { container } = render(Terminal, { output: [] });
		expect(container).toBeInTheDocument();
	});
});
