import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EditorTitleControl from './EditorTitleControl.svelte';

describe('EditorTitleControl', () => {
	it('renders container', () => {
		const { container } = render(EditorTitleControl);
		expect(container.firstElementChild).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(EditorTitleControl, { class: 'custom-test' });
		expect(container.firstElementChild!.className).toContain('custom-test');
	});
});
