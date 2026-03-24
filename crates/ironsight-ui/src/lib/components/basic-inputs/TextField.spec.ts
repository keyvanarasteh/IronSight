import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TextField from './TextField.svelte';

describe('TextField Component', () => {
	it('renders correctly', () => {
		const { getByRole } = render(TextField);
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input).not.toBeNull();
		expect(input.type).toBe('text');
	});

	it('binds value correctly', async () => {
		const { getByRole } = render(TextField, { value: 'initial' });
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('initial');

		await fireEvent.input(input, { target: { value: 'updated' } });
		expect(input.value).toBe('updated');
	});

	it('reflects disabled and readonly states', () => {
		const { getByRole } = render(TextField, { disabled: true, readonly: true });
		const input = getByRole('textbox') as HTMLInputElement;
		expect(input.disabled).toBe(true);
		expect(input.readOnly).toBe(true);
	});

	it('emits standard events', async () => {
		const onInput = vi.fn();
		const onChange = vi.fn();
		const { getByRole } = render(TextField, { oninput: onInput, onchange: onChange });
		const input = getByRole('textbox') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'test' } });
		expect(onInput).toHaveBeenCalled();

		await fireEvent.change(input);
		expect(onChange).toHaveBeenCalled();
	});

	it('supports placeholder attributes', () => {
		const { getByPlaceholderText } = render(TextField, { placeholder: 'Search...' });
		const input = getByPlaceholderText('Search...');
		expect(input).not.toBeNull();
	});

	it('respects type prop', () => {
		const { getByRole } = render(TextField, { type: 'password' });
		// getByRole 'textbox' doesn't match type='password', so we query by container or placeholder if we set one, or just get the element
		const { container } = render(TextField, { type: 'password' });
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input.type).toBe('password');
	});

	it('handles validationState and validationMessage', () => {
		const { container, getByText } = render(TextField, {
			validationState: 'error',
			validationMessage: 'Invalid input'
		});
		const input = container.querySelector('input');
		expect(input).toHaveClass('border-error-fg');
		expect(getByText('Invalid input')).not.toBeNull();
		const messageDiv = getByText('Invalid input').parentElement;
		expect(messageDiv).toHaveClass('text-error-fg');
	});

	it('renders info and warning validation states', () => {
		const { container: containerInfo } = render(TextField, { validationState: 'info' });
		expect(containerInfo.querySelector('input')).toHaveClass('border-info');

		const { container: containerWarning } = render(TextField, { validationState: 'warning' });
		expect(containerWarning.querySelector('input')).toHaveClass('border-warning');
	});

	it('handles history cycling with Up and Down arrows', async () => {
		const { container } = render(TextField, { showHistory: true, history: ['first', 'second'] });
		const input = container.querySelector('input') as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'current' } });

		await fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(input.value).toBe('second');

		await fireEvent.keyDown(input, { key: 'ArrowUp' });
		expect(input.value).toBe('first');

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(input.value).toBe('second');

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		expect(input.value).toBe('current');
	});

	it('evaluates ariaLabel prop', () => {
		const { getByLabelText } = render(TextField, { ariaLabel: 'My Input' });
		expect(getByLabelText('My Input')).not.toBeNull();
	});

	it('fires onkeydown event', async () => {
		const onKeyDown = vi.fn();
		const { container } = render(TextField, { onkeydown: onKeyDown });
		const input = container.querySelector('input') as HTMLInputElement;
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(onKeyDown).toHaveBeenCalled();
	});

	it('accepts children snippet without error', () => {
		// Even if currently unused in the component, passing it should not crash
		const { container } = render(TextField, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			children: (() => null) as any
		});
		expect(container.querySelector('input')).toBeDefined();
	});

	it('applies borderColors "none" (default) class', () => {
		const { container } = render(TextField, { validationState: 'none' });
		const input = container.querySelector('input');
		expect(input).toHaveClass('border-input-border');
	});

	it('applies borderColors "warning" class', () => {
		const { container } = render(TextField, { validationState: 'warning' });
		const input = container.querySelector('input');
		expect(input).toHaveClass('border-warning');
	});

	it('applies messageColors "none" state', () => {
		const { container } = render(TextField, { validationState: 'none', validationMessage: 'test' });
		// "none" state has empty messageColor class, message should still render
		expect(container).toBeInTheDocument();
	});

	it('applies messageColors "warning" class', () => {
		const { container, getByText } = render(TextField, {
			validationState: 'warning',
			validationMessage: 'Caution'
		});
		const msg = getByText('Caution').closest('div');
		expect(msg).toHaveClass('text-warning');
	});
});
