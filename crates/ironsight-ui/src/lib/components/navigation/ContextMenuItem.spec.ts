import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ContextMenuItem from './ContextMenuItem.svelte';

describe('ContextMenuItem Component', () => {
	it('renders a separator when separator=true', () => {
		const { container } = render(ContextMenuItem, { separator: true });
		const hr = container.querySelector('[class*="border-b"]');
		expect(hr).not.toBeNull();
	});

	it('renders label text', () => {
		const { getByText } = render(ContextMenuItem, { label: 'Copy' });
		expect(getByText('Copy')).not.toBeNull();
	});

	it('renders keybinding text', () => {
		const { getByText } = render(ContextMenuItem, { label: 'Copy', keybinding: 'Ctrl+C' });
		expect(getByText('Ctrl+C')).not.toBeNull();
	});

	it('calls onselect when clicked', async () => {
		const onselect = vi.fn();
		const { getByRole } = render(ContextMenuItem, { label: 'Paste', value: 'paste', onselect });
		const button = getByRole('button');

		await fireEvent.click(button);

		expect(onselect).toHaveBeenCalledWith(
			expect.objectContaining({ label: 'Paste', value: 'paste' })
		);
	});

	it('does not call onselect when separator is clicked', async () => {
		const onselect = vi.fn();
		const { container } = render(ContextMenuItem, { separator: true, onselect });

		await fireEvent.click(container.firstElementChild!);
		expect(onselect).not.toHaveBeenCalled();
	});

	it('applies selected styling', () => {
		const { getByRole } = render(ContextMenuItem, { label: 'Test', selected: true });
		const button = getByRole('button');
		expect(button.className).toContain('bg-menu-selection');
	});

	it('accepts icon prop', () => {
		const { container } = render(ContextMenuItem, { icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts checked prop', () => {
		const { container } = render(ContextMenuItem, { checked: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts disabled prop', () => {
		const { container } = render(ContextMenuItem, { disabled: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts submenu prop', () => {
		const { container } = render(ContextMenuItem, { submenu: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts tabindex prop', () => {
		const { container } = render(ContextMenuItem, { tabindex: 0 });
		expect(container).toBeInTheDocument();
	});
});
