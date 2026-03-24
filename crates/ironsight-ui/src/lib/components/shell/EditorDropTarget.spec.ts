import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditorDropTarget from './EditorDropTarget.svelte';

describe('EditorDropTarget', () => {
	it('renders container', () => {
		const { container } = render(EditorDropTarget);
		expect(container.firstElementChild).not.toBeNull();
	});
});
