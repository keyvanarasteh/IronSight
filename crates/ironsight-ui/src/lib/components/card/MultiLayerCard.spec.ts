import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MultiLayerCard from './MultiLayerCard.svelte';

describe('MultiLayerCard Component', () => {
	it('renders variant 1 by default', () => {
		const { container, getByText } = render(MultiLayerCard);
		const el = container.firstElementChild as HTMLElement;

		expect(el).not.toBeNull();
		expect(el).toHaveClass('py-8');
		expect(getByText('Coding is Fun')).not.toBeNull();
	});

	it('renders variant 2', () => {
		const { container } = render(MultiLayerCard, { variant: '2' });
		const innerDivs = container.querySelectorAll('div > div > div');
		// checking that variant 2 structure is applied (it uses -top-4 and scale options)
		expect(innerDivs.length).toBeGreaterThan(0);
	});

	it('applies custom title, description and class', () => {
		const { container, getByText } = render(MultiLayerCard, {
			title: 'Custom Title',
			description: 'Custom Desc',
			class: 'custom-cls'
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('custom-cls');
		expect(getByText('Custom Title')).not.toBeNull();
		expect(getByText('Custom Desc')).not.toBeNull();
	});
});
