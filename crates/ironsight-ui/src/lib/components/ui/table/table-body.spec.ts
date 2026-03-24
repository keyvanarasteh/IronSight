import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-body from './table-body.svelte';

describe('table-body Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-body);
		expect(container).toBeTruthy();
	});
});
