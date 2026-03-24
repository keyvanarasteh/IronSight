import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SkeletonCard from './SkeletonCard.svelte';

describe('SkeletonCard Component', () => {
	it('renders default skeleton card', () => {
		const { container } = render(SkeletonCard);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('animate-pulse', 'rounded-md', 'border', 'p-4', 'shadow-sm');
		expect(el.getAttribute('aria-hidden')).toBe('true');

		const childDivs = container.querySelectorAll('div > div');
		expect(childDivs.length).toBeGreaterThan(0);
	});

	it('applies custom class', () => {
		const { container } = render(SkeletonCard, { class: 'my-custom-skel' });
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('my-custom-skel');
	});
});
