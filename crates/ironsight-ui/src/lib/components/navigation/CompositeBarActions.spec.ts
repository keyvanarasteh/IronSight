import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CompositeBarActions from './CompositeBarActions.svelte';

describe('CompositeBarActions', () => {
	it('renders menu role', () => {
		const { getByRole } = render(CompositeBarActions);
		expect(getByRole('menu')).toBeInTheDocument();
	});

	it('accepts itemLabel prop', () => {
		const { container } = render(CompositeBarActions, { itemLabel: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts pinned prop', () => {
		const { container } = render(CompositeBarActions, { pinned: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts onunpin callback prop', () => {
		const onunpin = vi.fn();
		const { container } = render(CompositeBarActions, { onunpin });
		expect(container).toBeInTheDocument();
	});

	it('accepts onhide callback prop', () => {
		const onhide = vi.fn();
		const { container } = render(CompositeBarActions, { onhide });
		expect(container).toBeInTheDocument();
	});

	it('accepts onmoveup callback prop', () => {
		const onmoveup = vi.fn();
		const { container } = render(CompositeBarActions, { onmoveup });
		expect(container).toBeInTheDocument();
	});

	it('accepts onmovedown callback prop', () => {
		const onmovedown = vi.fn();
		const { container } = render(CompositeBarActions, { onmovedown });
		expect(container).toBeInTheDocument();
	});
});
