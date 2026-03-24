import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-content from './dialog-content.svelte';

describe('dialog-content Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-content);
		expect(container).toBeTruthy();
	});
});
