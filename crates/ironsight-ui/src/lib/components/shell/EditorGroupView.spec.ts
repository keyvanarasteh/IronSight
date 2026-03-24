import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EditorGroupView from './EditorGroupView.svelte';

describe('EditorGroupView', () => {
	it('renders tabpanel role', () => {
		const { getByRole } = render(EditorGroupView, { id: 'group-1' });
		expect(getByRole('tabpanel')).toBeInTheDocument();
	});

	it('applies active styling when active', () => {
		const { getByRole } = render(EditorGroupView, { id: 'g1', active: true });
		const panel = getByRole('tabpanel');
		expect(panel.className).toContain('z-10');
	});
});
