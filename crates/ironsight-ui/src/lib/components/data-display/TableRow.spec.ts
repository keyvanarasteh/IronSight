import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TableRow from './TableRow.svelte';

describe('TableRow Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TableRow);
		expect(container).toBeTruthy();
	});
});
