import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CardImage from './CardImage.svelte';

describe('CardImage Component', () => {
	it('renders with required props', () => {
		const { getByRole, getByText, container } = render(CardImage, {
			src: 'test-image.jpg',
			alt: 'Test Alt',
			title: 'Test Title',
			description: 'Test Description'
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('group', 'relative', 'overflow-hidden', 'rounded-2xl');

		const img = getByRole('img');
		expect(img.getAttribute('src')).toBe('test-image.jpg');
		expect(img.getAttribute('alt')).toBe('Test Alt');

		expect(getByText('Test Title')).not.toBeNull();
		expect(getByText('Test Description')).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(CardImage, {
			src: 'test.jpg',
			alt: 'Test',
			title: 'Title',
			description: 'Desc',
			class: 'custom-img-card'
		});
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('custom-img-card');
	});
});
