import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-row from './table-row.svelte';

describe('table-row Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-row);
		expect(container).toBeTruthy();
	});
});
