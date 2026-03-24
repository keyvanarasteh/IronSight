import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PremiumCard from './PremiumCard.svelte';

describe('PremiumCard Component', () => {
	it('renders variant 1 by default', () => {
		const { container, getByRole, getByText } = render(PremiumCard);
		const el = container.firstElementChild as HTMLElement;

		expect(el).not.toBeNull();
		expect(el).toHaveClass('group', 'relative', 'aspect-[4/3]');

		const img = getByRole('img');
		expect(img).not.toBeNull();
		expect(getByText('The Godfather')).not.toBeNull();
	});

	it('renders variant 4 with button link', () => {
		const { getByRole, getByText } = render(PremiumCard, {
			variant: '4',
			title: 'Link Card',
			buttonText: 'Click Me',
			href: '/somewhere'
		});

		const link = getByRole('link');
		expect(link).not.toBeNull();
		expect(link.getAttribute('href')).toBe('/somewhere');
		expect(link.textContent).toBe('Click Me');
		expect(getByText('Link Card')).not.toBeNull();
	});

	it('applies custom image and class', () => {
		const { container, getByRole } = render(PremiumCard, {
			image: 'custom.jpg',
			class: 'prem-cus'
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('prem-cus');

		const img = getByRole('img');
		expect(img.getAttribute('src')).toBe('custom.jpg');
	});

	it('renders custom description', () => {
		const { getByText } = render(PremiumCard, { description: 'Custom Desc' });
		expect(getByText('Custom Desc')).not.toBeNull();
	});
});
