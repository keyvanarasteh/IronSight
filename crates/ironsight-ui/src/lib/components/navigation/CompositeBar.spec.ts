import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CompositeBar from './CompositeBar.svelte';
import type { CompositeItem } from './CompositeBar.svelte';

describe('CompositeBar', () => {
	const items: CompositeItem[] = [
		{ id: 'search', label: 'Search', icon: null as any },
		{ id: 'settings', label: 'Settings', icon: null as any }
	];

	it('renders tablist', () => {
		const { getByRole } = render(CompositeBar, { items });
		expect(getByRole('tablist')).toBeInTheDocument();
	});

	it('renders tabs with labels', () => {
		const { getAllByRole } = render(CompositeBar, { items });
		expect(getAllByRole('tab')).toHaveLength(2);
	});

	it('marks active tab', () => {
		const { getAllByRole } = render(CompositeBar, { items, activeId: 'settings' });
		const tabs = getAllByRole('tab');
		expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
	});

	it('accepts items prop', () => {
		const { container } = render(CompositeBar, { items: [] as CompositeItem[] });
		expect(container).toBeInTheDocument();
	});

	it('accepts orientation prop', () => {
		const { container } = render(CompositeBar, {
			orientation: 'vertical' as 'vertical' | 'horizontal'
		});
		expect(container).toBeInTheDocument();
	});

	it('calls onselect handler when tab is clicked', async () => {
		const onselect = vi.fn();
		const { getAllByRole } = render(CompositeBar, { items, onselect });
		const tabs = getAllByRole('tab');
		if (tabs[0]) await fireEvent.click(tabs[0]);
		expect(onselect).toHaveBeenCalled();
	});

	it('accepts oncontextmenu callback prop', () => {
		const oncontextmenu = vi.fn();
		const { container } = render(CompositeBar, { items, oncontextmenu });
		expect(container).toBeInTheDocument();
	});

	it('accepts onpin callback prop', () => {
		const onpin = vi.fn();
		const { container } = render(CompositeBar, { items, onpin });
		expect(container).toBeInTheDocument();
	});

	it('accepts onreorder callback prop', () => {
		const onreorder = vi.fn();
		const { container } = render(CompositeBar, { items, onreorder });
		expect(container).toBeInTheDocument();
	});
});
