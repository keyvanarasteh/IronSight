import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import AdvancedTreeView from './AdvancedTreeView.svelte';

describe('AdvancedTreeView', () => {
	const nodes = [
		{
			id: '1',
			label: 'src',
			children: [
				{ id: '1.1', label: 'index.ts' },
				{ id: '1.2', label: 'app.svelte' }
			]
		},
		{ id: '2', label: 'README.md' }
	];

	it('renders tree role', () => {
		const { getByRole } = render(AdvancedTreeView, { nodes });
		expect(getByRole('tree')).toBeInTheDocument();
	});

	it('renders tree items', () => {
		const { getAllByRole } = render(AdvancedTreeView, { nodes });
		expect(getAllByRole('treeitem').length).toBeGreaterThanOrEqual(2);
	});

	it('renders node labels', () => {
		const { getByText } = render(AdvancedTreeView, { nodes });
		// Explicitly check for node presence from the 'nodes' prop
		expect(getByText('src')).toBeInTheDocument();
		expect(getByText('README.md')).toBeInTheDocument();
	});

	it('respects expandedIds to render children', () => {
		const expandedIds = new Set(['1']);
		const { getByText } = render(AdvancedTreeView, { nodes, expandedIds });
		// This confirms that passing the 'expandedIds' prop correctly triggers rendering of children
		expect(getByText('index.ts')).toBeInTheDocument();
		expect(getByText('app.svelte')).toBeInTheDocument();
	});

	it('reflects selected state', () => {
		const { getByRole } = render(AdvancedTreeView, { nodes, selected: '2' });
		const items = getByRole('tree').querySelectorAll('[role="treeitem"]');
		expect(items[0]?.getAttribute('aria-selected')).toBe('false');
		expect(items[1]?.getAttribute('aria-selected')).toBe('true');
	});

	it('reflects checkedIds when showCheckboxes is true', () => {
		const checkedIds = new Set(['2']);
		const { container } = render(AdvancedTreeView, { nodes, checkedIds, showCheckboxes: true });
		const checkboxes = container.querySelectorAll('[role="checkbox"]');
		expect(checkboxes[0]?.getAttribute('aria-checked')).toBe('false');
		expect(checkboxes[1]?.getAttribute('aria-checked')).toBe('true');
	});

	it('respects indent prop for nested elements', () => {
		const expandedIds = new Set(['1']);
		const { container } = render(AdvancedTreeView, { nodes, expandedIds, indent: 24 });

		const treeitems = container.querySelectorAll('[role="treeitem"]');
		const indexItem = treeitems[1] as HTMLElement;
		// index.ts is at depth 1, so padding should be 24px
		expect(indexItem.style.paddingLeft).toBe('24px');
	});

	it('accepts nodes prop', () => {
		const { container } = render(AdvancedTreeView, { nodes: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts expandedIds prop', () => {
		const { container } = render(AdvancedTreeView, { expandedIds: new Set<string>() });
		expect(container).toBeInTheDocument();
	});

	it('accepts checkedIds prop', () => {
		const { container } = render(AdvancedTreeView, { checkedIds: new Set<string>() });
		expect(container).toBeInTheDocument();
	});

	it('calls onselect when a tree item is clicked', async () => {
		const onselect = vi.fn();
		const { container } = render(AdvancedTreeView, { nodes, onselect });
		const item = container.querySelector('[role="treeitem"]') as HTMLElement;
		if (item) await fireEvent.click(item);
		expect(onselect).toHaveBeenCalled();
	});

	it('calls oncheck when a checkbox is clicked', async () => {
		const oncheck = vi.fn();
		const checkedIds = new Set<string>();
		const { container } = render(AdvancedTreeView, {
			nodes,
			oncheck,
			showCheckboxes: true,
			checkedIds
		});
		const checkbox = container.querySelector('[role="checkbox"]') as HTMLElement;
		if (checkbox) await fireEvent.click(checkbox);
		expect(oncheck).toHaveBeenCalled();
	});

	it('calls oncontextmenu when right-clicking a tree item', async () => {
		const oncontextmenu = vi.fn();
		const { container } = render(AdvancedTreeView, { nodes, oncontextmenu });
		const item = container.querySelector('[role="treeitem"]') as HTMLElement;
		if (item) await fireEvent.contextMenu(item);
		expect(oncontextmenu).toHaveBeenCalled();
	});

	it('accepts itemActions snippet prop without error', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(AdvancedTreeView, { nodes, itemActions: (() => null) as any });
		expect(container.querySelector('[role="tree"]')).toBeInTheDocument();
	});
});
