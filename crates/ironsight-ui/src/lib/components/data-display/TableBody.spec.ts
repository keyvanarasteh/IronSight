import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TableBody from './TableBody.svelte';

describe('TableBody Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TableBody);
		expect(container).toBeTruthy();
	});
});
