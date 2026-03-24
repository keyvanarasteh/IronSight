import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PanelTab from './PanelTab.svelte';

describe('PanelTab', () => {
	it('renders label correctly', () => {
		const { getByText } = render(PanelTab, { label: 'Terminal' });
		expect(getByText('Terminal')).toBeInTheDocument();
	});

	it('shows count badge when count is provided', () => {
		const { getByText } = render(PanelTab, { label: 'Problems', count: 5 });
		expect(getByText('5')).toBeInTheDocument();
		expect(getByText('5')).toHaveClass('bg-muted');
	});

	it('shows active state correctly', () => {
		const { getByRole } = render(PanelTab, { label: 'Terminal', active: true });
		expect(getByRole('button')).toHaveClass('border-b');
	});

	it('handles click events', async () => {
		const onclick = vi.fn();
		const { getByRole } = render(PanelTab, { label: 'Terminal', onclick });

		const btn = getByRole('button');
		await fireEvent.click(btn);

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('calls onclick handler', async () => {
		const onclick = vi.fn();
		const { container } = render(PanelTab, { onclick });
		const el = container.querySelector('*');
		if (el) await fireEvent.click(el);
		expect(onclick).toHaveBeenCalled();
	});
});
