import { describe, it, expect, fireEvent } from 'vitest';
import { render } from '@testing-library/svelte';
import MultiRowEditorTabs from './MultiRowEditorTabs.svelte';

describe('MultiRowEditorTabs', () => {
	it('renders tablist', () => {
		const { getByRole } = render(MultiRowEditorTabs, {
			tabs: [{ id: '1', label: 'file.ts' }]
		});
		expect(getByRole('tablist')).toBeInTheDocument();
	});

	it('accepts activeId prop', () => {
		const { container } = render(MultiRowEditorTabs, { activeId: '' });
		expect(container).toBeInTheDocument();
	});
});
