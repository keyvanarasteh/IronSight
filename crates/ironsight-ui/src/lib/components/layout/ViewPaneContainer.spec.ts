import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ViewPaneContainer from './ViewPaneContainer.svelte';

describe('ViewPaneContainer', () => {
	it('renders complementary region', () => {
		const { getByRole } = render(ViewPaneContainer);
		expect(getByRole('complementary')).toBeInTheDocument();
	});
});
