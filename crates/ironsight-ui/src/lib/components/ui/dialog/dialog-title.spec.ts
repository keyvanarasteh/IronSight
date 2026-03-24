import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import dialog-title from './dialog-title.svelte';

describe('dialog-title Component', () => {
	it('renders without crashing', () => {
		const { container } = render(dialog-title);
		expect(container).toBeTruthy();
	});
});
