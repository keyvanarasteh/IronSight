import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-head from './table-head.svelte';

describe('table-head Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-head);
		expect(container).toBeTruthy();
	});
});
