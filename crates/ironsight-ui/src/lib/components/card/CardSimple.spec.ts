import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CardSimple from './CardSimple.svelte';

describe('CardSimple Component', () => {
	it('renders basic structure', () => {
		const { container } = render(CardSimple);
		const el = container.firstElementChild as HTMLElement;

		expect(el).not.toBeNull();
		expect(el).toHaveClass('relative', 'flex', 'flex-col', 'rounded-xl', 'border', 'bg-white');
	});

	it('applies custom class', () => {
		const { container } = render(CardSimple, { class: 'my-simple' });
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('my-simple');
	});

	it('renders header and footer snippets', async () => {
		const { createRawSnippet } = await import('svelte');
		const headerSnippet = createRawSnippet(() => ({
			render: () => '<h2 data-testid="hdr">Header</h2>'
		}));
		const footerSnippet = createRawSnippet(() => ({
			render: () => '<div data-testid="ftr">Footer</div>'
		}));

		const { getByTestId } = render(CardSimple, { header: headerSnippet, footer: footerSnippet });

		expect(getByTestId('hdr')).not.toBeNull();
		expect(getByTestId('ftr')).not.toBeNull();
	});
});
