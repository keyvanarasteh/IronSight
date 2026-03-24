import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HighlightedLabel from './HighlightedLabel.svelte';

describe('HighlightedLabel Component', () => {
	it('renders text', () => {
		render(HighlightedLabel, { text: 'Hello World' });
		expect(screen.getByText('Hello World')).not.toBeNull();
	});

	it('renders without highlights', () => {
		const { container } = render(HighlightedLabel, { text: 'Plain text', highlights: [] });
		expect(container.querySelector('.bg-find-match')).toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(HighlightedLabel, { text: 'Test', class: 'my-label' });
		const el = container.firstChild as HTMLElement;
		expect(el).toHaveClass('my-label');
	});
});
