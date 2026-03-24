import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import SingleEditorTab from './SingleEditorTab.svelte';
import { Search } from 'lucide-svelte';

describe('SingleEditorTab', () => {
	it('renders the tab label', () => {
		const { getByText } = render(SingleEditorTab, { label: 'index.ts' });
		expect(getByText('index.ts')).toBeInTheDocument();
	});

	it('has tab role', () => {
		const { getByRole } = render(SingleEditorTab, { label: 'file.rs' });
		expect(getByRole('tab')).toBeInTheDocument();
	});

	it('shows dirty indicator circle', () => {
		const { container } = render(SingleEditorTab, { label: 'file.rs', dirty: true });
		const circle = container.querySelector('.rounded-full');
		expect(circle).not.toBeNull();
	});

	it('accepts icon prop', () => {
		const { container } = render(SingleEditorTab, { icon: Search });
		expect(container).toBeInTheDocument();
	});
});
