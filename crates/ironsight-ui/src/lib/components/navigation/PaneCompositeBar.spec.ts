import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PaneCompositeBar from './PaneCompositeBar.svelte';

describe('PaneCompositeBar', () => {
	const items = [
		{ id: 'search', label: 'Search' },
		{ id: 'settings', label: 'Settings' }
	];

	it('renders tablist', () => {
		const { getByRole } = render(PaneCompositeBar, { items });
		expect(getByRole('tablist')).toBeInTheDocument();
	});

	it('renders tabs', () => {
		const { getAllByRole } = render(PaneCompositeBar, { items });
		expect(getAllByRole('tab')).toHaveLength(2);
	});

	it('accepts items prop', () => {
		const { container } = render(PaneCompositeBar, {
			items: [] as Array<{ id: string; label: string }>
		});
		expect(container).toBeInTheDocument();
	});

	it('accepts activeId prop', () => {
		const { container } = render(PaneCompositeBar, { activeId: '' });
		expect(container).toBeInTheDocument();
	});

	it('calls onselect handler when tab is clicked', async () => {
		const onselect = vi.fn();
		const { getAllByRole } = render(PaneCompositeBar, { items, onselect });
		const tabs = getAllByRole('tab');
		if (tabs[0]) await fireEvent.click(tabs[0]);
		expect(onselect).toHaveBeenCalled();
	});
});
