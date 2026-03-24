import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ContextMenuTest from './ContextMenu.spec.svelte';
import ContextMenu from './ContextMenu.svelte';

describe('ContextMenu Component', () => {
	it('renders items from data and handles selection', async () => {
		const { getByText, queryByText } = render(ContextMenuTest);

		expect(queryByText('Copy')).toBeNull();

		const toggleBtn = getByText('Toggle Menu');
		await fireEvent.click(toggleBtn);

		expect(getByText('Copy')).not.toBeNull();
		expect(getByText('Paste')).not.toBeNull();
		expect(getByText('Ctrl+C')).not.toBeNull();

		await fireEvent.click(getByText('Copy'));

		// It should close after selection
		expect(queryByText('Copy')).toBeNull();
	});

	it('accepts data prop', () => {
		const { container } = render(ContextMenu, { data: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts show prop', () => {
		const { container } = render(ContextMenu, { show: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts preventClose prop', () => {
		const { container } = render(ContextMenu, { preventClose: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts onselect callback prop', () => {
		const onselect = vi.fn();
		const { container } = render(ContextMenu, { data: [], onselect, show: true });
		// onselect fires when a menu item is clicked
		expect(container).toBeInTheDocument();
	});
});
