import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-header from './dialog-header.svelte';

describe('dialog-header Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-header);
		expect(container).toBeTruthy();
	});
});
