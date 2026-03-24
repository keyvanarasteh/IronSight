import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Radio from './Radio.svelte';

describe('Radio Component', () => {
	it('renders correctly as unchecked by default', () => {
		const { getByRole } = render(Radio);
		const radio = getByRole('radio') as HTMLInputElement;
		expect(radio).not.toBeNull();
		expect(radio.checked).toBe(false);
	});

	it('reflects checked state', () => {
		const { getByRole } = render(Radio, { checked: true });
		const radio = getByRole('radio') as HTMLInputElement;
		expect(radio.checked).toBe(true);
	});

	it('emits change events and updates state', async () => {
		const onChange = vi.fn();
		const { getByRole } = render(Radio, { onchange: onChange });
		const radio = getByRole('radio') as HTMLInputElement;

		await fireEvent.click(radio);
		expect(radio.checked).toBe(true);
		expect(onChange).toHaveBeenCalled();
	});

	it('disables correctly', () => {
		const { getByRole } = render(Radio, { disabled: true });
		const radio = getByRole('radio') as HTMLInputElement;
		expect(radio.disabled).toBe(true);
	});

	it('applies invalid styles', () => {
		const { container } = render(Radio, { invalid: true });
		const displayDiv = container.querySelector('.bg-destructive-bg.border-destructive');
		expect(displayDiv).not.toBeNull();
	});

	it('sets required attribute', () => {
		const { getByRole } = render(Radio, { required: true });
		const radio = getByRole('radio') as HTMLInputElement;
		expect(radio.required).toBe(true);
	});

	it('respects value and name props', () => {
		const { getByRole } = render(Radio, { value: 'option-a', name: 'radio-group' });
		const radio = getByRole('radio') as HTMLInputElement;
		expect(radio.value).toBe('option-a');
		expect(radio.name).toBe('radio-group');
	});
});
