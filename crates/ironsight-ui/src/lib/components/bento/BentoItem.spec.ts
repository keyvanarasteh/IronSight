import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BentoItem from './BentoItem.svelte';

describe('BentoItem Component', () => {
	it('renders correctly with default styles', () => {
		const { container } = render(BentoItem);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass(
			'group',
			'relative',
			'overflow-hidden',
			'rounded-xl',
			'border',
			'bg-card',
			'p-6'
		);
	});

	it('applies custom classes', () => {
		const { container } = render(BentoItem, { class: 'custom-class' });
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('custom-class');
	});
});
