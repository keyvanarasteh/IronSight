import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table from './table.svelte';

describe('table Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table);
		expect(container).toBeTruthy();
	});
});
