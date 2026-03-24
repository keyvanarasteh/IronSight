import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SkeletonProfile from './SkeletonProfile.svelte';

describe('SkeletonProfile Component', () => {
	it('renders default skeleton profile', () => {
		const { container } = render(SkeletonProfile);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass(
			'animate-pulse',
			'rounded-lg',
			'border',
			'p-4',
			'shadow-sm',
			'space-x-4'
		);
		expect(el.getAttribute('aria-hidden')).toBe('true');

		// check for avatar circle placeholder
		const avatar = container.querySelector('.rounded-full');
		expect(avatar).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(SkeletonProfile, { class: 'my-custom-prof' });
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('my-custom-prof');
	});
});
