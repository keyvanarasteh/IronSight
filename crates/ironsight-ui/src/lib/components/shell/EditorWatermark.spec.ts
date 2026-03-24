import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EditorWatermark from './EditorWatermark.svelte';

describe('EditorWatermark', () => {
	it('renders with presentation role', () => {
		const { getByRole } = render(EditorWatermark);
		expect(getByRole('presentation')).toBeInTheDocument();
	});

	it('renders built-in shortcut labels', () => {
		const { getByText } = render(EditorWatermark);
		expect(getByText('Show All Commands')).toBeInTheDocument();
		expect(getByText('Open File')).toBeInTheDocument();
	});

	it('accepts showKeybindings prop', () => {
		const { container } = render(EditorWatermark, { showKeybindings: true });
		expect(container).toBeInTheDocument();
	});
});
