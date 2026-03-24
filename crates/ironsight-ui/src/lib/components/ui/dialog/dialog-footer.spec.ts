import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-footer from './dialog-footer.svelte';

describe('dialog-footer Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-footer);
		expect(container).toBeTruthy();
	});
});
