import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CenteredLayout from './CenteredLayout.svelte';

describe('CenteredLayout Component', () => {
	it('renders centered container', () => {
		const { container } = render(CenteredLayout);
		const el = container.firstChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('mx-auto');
	});

	it('applies max-width style', () => {
		const { container } = render(CenteredLayout, { maxWidth: '600px' });
		const el = container.firstChild as HTMLElement;
		expect(el.style.maxWidth).toBe('600px');
	});

	it('accepts gutters prop', () => {
		const { container } = render(CenteredLayout, { gutters: '20px' });
		expect(container).toBeInTheDocument();
	});
});
