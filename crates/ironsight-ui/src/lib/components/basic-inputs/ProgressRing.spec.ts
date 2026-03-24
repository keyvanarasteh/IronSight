import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ProgressRing from './ProgressRing.svelte';

describe('ProgressRing Component', () => {
	it('renders generic alert state', () => {
		const { getByRole } = render(ProgressRing);
		const progress = getByRole('alert');
		expect(progress).not.toBeNull();
		expect(progress.getAttribute('aria-live')).toBe('assertive');
	});
});
