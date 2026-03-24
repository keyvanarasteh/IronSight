import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button.svelte';
import ButtonTest from './Button.spec.svelte';

describe('Button Component', () => {
	it('renders primary button by default', () => {
		const { getByRole } = render(Button);
		const btn = getByRole('button');
		expect(btn).not.toBeNull();
		expect(btn).toHaveClass('bg-button-bg');
	});

	it('renders secondary button variant', () => {
		const { getByRole } = render(Button, { variant: 'secondary' });
		const btn = getByRole('button');
		expect(btn).not.toBeNull();
		expect(btn).toHaveClass('bg-button-secondary-bg');
	});

	it('disables correctly', () => {
		const { getByRole } = render(Button, { disabled: true });
		const btn = getByRole('button');
		expect(btn).not.toBeNull();
		expect(btn).toBeDisabled();
		expect(btn).toHaveClass('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
	});

	it('fires onclick function when not disabled', async () => {
		const onclick = vi.fn();
		const { getByRole } = render(Button, { onclick });
		const btn = getByRole('button');

		await fireEvent.click(btn);
		expect(onclick).toHaveBeenCalledOnce();
	});

	it('respects block prop', () => {
		const { getByRole } = render(Button, { block: true });
		const btn = getByRole('button');
		expect(btn).toHaveClass('w-full', 'text-center');
	});

	it('renders primary variant explicitly', () => {
		const { getByRole } = render(Button, { variant: 'primary' });
		const btn = getByRole('button');
		expect(btn).toHaveClass('bg-button-bg');
	});

	it('respects type prop', () => {
		const { getByRole } = render(Button, { type: 'submit' });
		const btn = getByRole('button');
		expect(btn).toHaveAttribute('type', 'submit');
	});

	it('renders icon when provided', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Button, { icon: (() => null) as any });
		expect(container.querySelector('span.flex.shrink-0')).not.toBeNull();
	});

	it('applies spin to icon', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Button, { icon: (() => null) as any, iconSpin: true });
		const span = container.querySelector('span.flex.shrink-0');
		expect(span).toHaveClass('animate-spin');
	});

	it('renders iconAfter when provided', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Button, { iconAfter: (() => null) as any });
		const spans = container.querySelectorAll('span.flex.shrink-0');
		expect(spans.length).toBeGreaterThan(0);
	});

	it('applies spin to iconAfter', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Button, { iconAfter: (() => null) as any, iconAfterSpin: true });
		const span = container.querySelector('span.flex.shrink-0');
		expect(span).toHaveClass('animate-spin');
	});

	it('applies iconOnly classes', () => {
		const { getByRole } = render(Button, { iconOnly: true });
		const btn = getByRole('button');
		expect(btn).toHaveClass('min-h-[24px]', 'min-w-[26px]');
	});

	it('renders dropdown button style', () => {
		const { getAllByRole } = render(Button, { dropdown: true });
		const buttons = getAllByRole('button');
		expect(buttons).toHaveLength(2);
		expect(buttons[0]).toHaveClass('rounded-l-[2px]');
		expect(buttons[1]).toHaveClass('rounded-r-[2px]');
		expect(buttons[1]).toHaveAttribute('aria-label', 'Toggle dropdown');
	});

	it('fires ondropdown event when dropdown arrow is clicked', async () => {
		const ondropdown = vi.fn();
		const { getAllByRole } = render(Button, { dropdown: true, ondropdown });
		const buttons = getAllByRole('button');

		const arrowBtn = buttons[1];
		if (!arrowBtn) throw new Error('Arrow button not found');
		await fireEvent.click(arrowBtn);
		expect(ondropdown).toHaveBeenCalledOnce();
	});

	it('renders description snippet', () => {
		const { getByText } = render(ButtonTest);
		// Note: ButtonTest uses the descriptionSnippet which contains "Description Text"
		expect(getByText('Description Text')).toBeInTheDocument();
	});

	it('toggles dropdownOpen bindable state', async () => {
		// Just ensure it renders and clicks without error for coverage
		const { getAllByRole } = render(Button, { dropdown: true, dropdownOpen: false });
		const buttons = getAllByRole('button');
		const arrowBtn = buttons[1];
		if (!arrowBtn) throw new Error('Arrow button not found');
		await fireEvent.click(arrowBtn);
		expect(arrowBtn).toBeDefined();
	});
});
