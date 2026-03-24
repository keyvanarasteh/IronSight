import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import MenuBarControl from './MenuBarControl.svelte';
import type { MenuBarItem } from './MenuBarControl.svelte';

describe('MenuBarControl', () => {
	const items: MenuBarItem[] = [
		{
			label: 'File',
			items: [
				{ label: 'New File', shortcut: 'Ctrl+N' },
				{ label: '---', separator: true },
				{ label: 'Exit' }
			]
		},
		{ label: 'Edit', items: [{ label: 'Undo', shortcut: 'Ctrl+Z' }] }
	];

	it('renders menubar role', () => {
		const { getByRole } = render(MenuBarControl, { items });
		expect(getByRole('menubar')).toBeInTheDocument();
	});

	it('renders menu items', () => {
		const { getByText } = render(MenuBarControl, { items });
		expect(getByText('File')).toBeInTheDocument();
		expect(getByText('Edit')).toBeInTheDocument();
	});

	it('opens submenu on click', async () => {
		const { getByText, getByRole } = render(MenuBarControl, { items });
		await fireEvent.click(getByText('File'));
		expect(getByRole('menu')).toBeInTheDocument();
		expect(getByText('New File')).toBeInTheDocument();
	});

	it('renders shortcuts in submenu', async () => {
		const { getByText } = render(MenuBarControl, { items });
		await fireEvent.click(getByText('File'));
		expect(getByText('Ctrl+N')).toBeInTheDocument();
	});

	it('accepts items prop', () => {
		const { container } = render(MenuBarControl, { items: [] as MenuBarItem[] });
		expect(container).toBeInTheDocument();
	});

	it('accepts compact prop', () => {
		const { container } = render(MenuBarControl, { compact: false });
		expect(container).toBeInTheDocument();
	});
});
