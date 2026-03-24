import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-header from './table-header.svelte';

describe('table-header Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-header);
		expect(container).toBeTruthy();
	});
});
