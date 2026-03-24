import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-description from './dialog-description.svelte';

describe('dialog-description Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-description);
		expect(container).toBeTruthy();
	});
});
