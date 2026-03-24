import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ToolbarButton from './ToolbarButton.svelte';

describe('ToolbarButton Component', () => {
	it('renders as a button', () => {
		const { getByRole } = render(ToolbarButton, { label: 'Test' });
		const button = getByRole('button');
		expect(button).not.toBeNull();
		expect(button.getAttribute('aria-label')).toBe('Test');
	});

	it('renders with title attribute', () => {
		const { getByRole } = render(ToolbarButton, { label: 'Action', title: 'Do action' });
		const button = getByRole('button');
		expect(button.getAttribute('title')).toBe('Do action');
	});

	it('handles toggle mode', async () => {
		const onChange = vi.fn();
		const { getByRole } = render(ToolbarButton, {
			label: 'Toggle',
			toggleable: true,
			onchange: onChange
		});
		const button = getByRole('switch');
		expect(button.getAttribute('aria-checked')).toBe('false');

		await fireEvent.click(button);

		expect(button.getAttribute('aria-checked')).toBe('true');
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('fires onclick in normal mode', async () => {
		const onClick = vi.fn();
		const { getByRole } = render(ToolbarButton, { label: 'Click', onclick: onClick });
		const button = getByRole('button');

		await fireEvent.click(button);
		expect(onClick).toHaveBeenCalled();
	});

	it('applies custom class', () => {
		const { getByRole } = render(ToolbarButton, { label: 'Styled', class: 'my-btn' });
		const button = getByRole('button');
		expect(button.className).toContain('my-btn');
	});

	it('accepts icon prop', () => {
		const { container } = render(ToolbarButton, { icon: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts checked prop', () => {
		const { container } = render(ToolbarButton, { checked: false });
		expect(container).toBeInTheDocument();
	});
});
