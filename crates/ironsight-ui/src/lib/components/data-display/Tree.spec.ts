import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TreeTest from './Tree.spec.svelte';
import Tree from './Tree.svelte';

describe('Tree Component Group', () => {
	it('renders tree and nested leaf items', async () => {
		const { getByText, getByRole } = render(TreeTest);

		expect(getByRole('tree')).not.toBeNull();
		const branch1 = getByText('Branch 1');
		expect(branch1).not.toBeNull();

		// Wait for click on branch to expand
		await fireEvent.click(branch1);

		expect(getByText('Leaf 1-1')).not.toBeNull();
		expect(getByText('Leaf 1-2')).not.toBeNull();
	});

	it('accepts expandMode prop', () => {
		const { container } = render(Tree, { expandMode: 'singleClick' });
		expect(container).toBeInTheDocument();
	});

	it('accepts hideArrows prop', () => {
		const { container } = render(Tree, { hideArrows: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts indent prop', () => {
		const { container } = render(Tree, { indent: 8 });
		expect(container).toBeInTheDocument();
	});

	it('accepts indentGuides prop', () => {
		const { container } = render(Tree, { indentGuides: 'onHover' });
		expect(container).toBeInTheDocument();
	});

	it('accepts multiSelect prop', () => {
		const { container } = render(Tree, { multiSelect: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts onSelect callback prop', () => {
		const onSelect = vi.fn();
		const { container } = render(Tree, { onSelect });
		// onSelect fires when a tree item is clicked
		expect(container).toBeInTheDocument();
	});
});
