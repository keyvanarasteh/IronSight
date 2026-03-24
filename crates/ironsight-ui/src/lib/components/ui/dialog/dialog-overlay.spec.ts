import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-overlay from './dialog-overlay.svelte';

describe('dialog-overlay Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-overlay);
		expect(container).toBeTruthy();
	});
});
