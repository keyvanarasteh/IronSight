import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import EditorActions from './EditorActions.svelte';

describe('EditorActions', () => {
	it('renders toolbar', () => {
		const { getByRole } = render(EditorActions);
		expect(getByRole('toolbar')).toBeInTheDocument();
	});

	it('accepts pinned prop', () => {
		const { container } = render(EditorActions, { pinned: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts locked prop', () => {
		const { container } = render(EditorActions, { locked: false });
		expect(container).toBeInTheDocument();
	});
});
