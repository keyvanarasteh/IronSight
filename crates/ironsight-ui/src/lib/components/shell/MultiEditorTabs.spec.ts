import { describe, it, expect, fireEvent } from 'vitest';
import { render } from '@testing-library/svelte';
import MultiEditorTabs from './MultiEditorTabs.svelte';

describe('MultiEditorTabs', () => {
	it('renders tablist', () => {
		const { getByRole } = render(MultiEditorTabs, {
			tabs: [{ id: '1', label: 'index.ts' }]
		});
		expect(getByRole('tablist')).toBeInTheDocument();
	});

	it('renders tab labels', () => {
		const { getByText } = render(MultiEditorTabs, {
			tabs: [
				{ id: '1', label: 'index.ts' },
				{ id: '2', label: 'app.svelte' }
			]
		});
		expect(getByText('index.ts')).toBeInTheDocument();
		expect(getByText('app.svelte')).toBeInTheDocument();
	});

	it('accepts activeId prop', () => {
		const { container } = render(MultiEditorTabs, { activeId: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts showScrollButtons prop', () => {
		const { container } = render(MultiEditorTabs, { showScrollButtons: true });
		expect(container).toBeInTheDocument();
	});
});
