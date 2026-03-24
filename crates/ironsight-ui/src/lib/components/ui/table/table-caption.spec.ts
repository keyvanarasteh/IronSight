import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import table-caption from './table-caption.svelte';

describe('table-caption Component', () => {
	it('renders without crashing', () => {
		const { container } = render(table-caption);
		expect(container).toBeTruthy();
	});
});
