import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-cell from './table-cell.svelte';

describe('table-cell Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-cell);
		expect(container).toBeTruthy();
	});
});
