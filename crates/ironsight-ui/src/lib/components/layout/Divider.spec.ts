import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Divider from './Divider.svelte';

describe('Divider Component', () => {
	it('renders generic separator state by default', () => {
		const { getByRole } = render(Divider);
		const progress = getByRole('separator');
		expect(progress).not.toBeNull();
	});

	it('renders presentation role if passed', () => {
		const { container } = render(Divider, { role: 'presentation' });
		const progress = container.querySelector('div[role="presentation"]');
		expect(progress).not.toBeNull();
	});
});
