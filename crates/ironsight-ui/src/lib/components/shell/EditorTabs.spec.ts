import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditorTabs from './EditorTabs.svelte';
import { FileCode } from 'lucide-svelte';
import type { FileItem } from '../../types';

describe('EditorTabs', () => {
	const files: FileItem[] = [
		{ name: 'App.svelte', icon: FileCode, lang: 'Svelte' },
		{ name: 'utils.ts', icon: FileCode, lang: 'TypeScript' }
	];

	const props = {
		files,
		activeTab: 'App.svelte',
		onTabClick: vi.fn(),
		onTabClose: vi.fn()
	};

	it('renders tabs', () => {
		const { getByText } = render(EditorTabs, props);
		expect(getByText('App.svelte')).toBeInTheDocument();
		expect(getByText('utils.ts')).toBeInTheDocument();
	});

	it('highlights active tab', () => {
		const { getByRole } = render(EditorTabs, props);
		const tabs = getByRole('button', { name: /app.svelte/i });
		expect(tabs).toHaveClass('bg-background');
	});

	it('handles tab click', async () => {
		const { getByRole } = render(EditorTabs, props);
		await fireEvent.click(getByRole('button', { name: /utils.ts/i }));
		expect(props.onTabClick).toHaveBeenCalledWith('utils.ts');
	});

	it('accepts files prop', () => {
		const { container } = render(EditorTabs, { files: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts activeTab prop', () => {
		const { container } = render(EditorTabs, { activeTab: 'test-value' });
		expect(container).toBeInTheDocument();
	});
});
