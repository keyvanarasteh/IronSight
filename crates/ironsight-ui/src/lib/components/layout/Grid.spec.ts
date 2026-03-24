import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Grid from './Grid.svelte';

describe('Grid Component', () => {
	it('renders grid container', () => {
		const { container } = render(Grid);
		const el = container.firstChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('grid');
	});

	it('applies column template', () => {
		const { container } = render(Grid, { columns: 3 });
		const el = container.firstChild as HTMLElement;
		expect(el.style.gridTemplateColumns).toContain('repeat(3');
	});

	it('accepts rows prop', () => {
		const { container } = render(Grid, { rows: 1 });
		expect(container).toBeInTheDocument();
	});

	it('accepts gap prop', () => {
		const { container } = render(Grid, { gap: 0 });
		expect(container).toBeInTheDocument();
	});
});
