import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox.svelte';

describe('Checkbox Component', () => {
	it('renders correctly as unchecked by default', () => {
		const { getByRole } = render(Checkbox);
		const checkbox = getByRole('checkbox') as HTMLInputElement;
		expect(checkbox).not.toBeNull();
		expect(checkbox.checked).toBe(false);
	});

	it('reflects checked state', () => {
		const { getByRole } = render(Checkbox, { checked: true });
		const checkbox = getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.checked).toBe(true);
	});

	it('emits change events and updates state', async () => {
		const onChange = vi.fn();
		const { getByRole } = render(Checkbox, { onchange: onChange });
		const checkbox = getByRole('checkbox') as HTMLInputElement;

		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
		expect(onChange).toHaveBeenCalled();
	});

	it('disables correctly', () => {
		const { getByRole } = render(Checkbox, { disabled: true });
		const checkbox = getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.disabled).toBe(true);
	});

	it('renders indeterminate state correctly', () => {
		const { container } = render(Checkbox, { indeterminate: true });
		// Indeterminate span has specific class
		const indeterminateSpan = container.querySelector('span.bg-currentColor');
		expect(indeterminateSpan).not.toBeNull();
	});

	it('applies invalid styles', () => {
		const { container } = render(Checkbox, { invalid: true });
		const displayDiv = container.querySelector('.bg-destructive-bg.border-destructive');
		expect(displayDiv).not.toBeNull();
	});

	it('sets required attribute', () => {
		const { getByRole } = render(Checkbox, { required: true });
		const checkbox = getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.required).toBe(true);
	});

	it('renders as a toggle switch when toggle prop is true', () => {
		const { container } = render(Checkbox, { toggle: true });
		const toggleDiv = container.querySelector('.items-center.rounded-full');
		expect(toggleDiv).not.toBeNull();
	});

	it('respects value and name props', () => {
		const { getByRole } = render(Checkbox, { value: 'my-value', name: 'my-name' });
		const checkbox = getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.value).toBe('my-value');
		expect(checkbox.name).toBe('my-name');
	});
});
