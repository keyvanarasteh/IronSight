import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TabPanel from './TabPanel.svelte';

describe('TabPanel Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TabPanel);
		expect(container).toBeTruthy();
	});
});
