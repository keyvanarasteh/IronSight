import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Textarea from './Textarea.svelte';

describe('Textarea Component', () => {
	it('renders correctly', () => {
		const { getByRole } = render(Textarea);
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea).not.toBeNull();
		expect(textarea.tagName).toBe('TEXTAREA');
	});

	it('binds value correctly', async () => {
		const { getByRole } = render(Textarea, { value: 'initial text' });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.value).toBe('initial text');

		await fireEvent.input(textarea, { target: { value: 'updated text' } });
		expect(textarea.value).toBe('updated text');
	});

	it('reflects disabled and readonly states', () => {
		const { getByRole } = render(Textarea, { disabled: true, readonly: true });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.disabled).toBe(true);
		expect(textarea.readOnly).toBe(true);
	});

	it('emits standard events', async () => {
		const onInput = vi.fn();
		const onChange = vi.fn();
		const { getByRole } = render(Textarea, { oninput: onInput, onchange: onChange });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;

		await fireEvent.input(textarea, { target: { value: 'test' } });
		expect(onInput).toHaveBeenCalled();

		await fireEvent.change(textarea);
		expect(onChange).toHaveBeenCalled();
	});

	it('reflects rows and cols', () => {
		const { getByRole } = render(Textarea, { rows: 5, cols: 20 });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(String(textarea.rows)).toBe('5');
		expect(String(textarea.cols)).toBe('20');
	});

	it('handles autocomplete, placeholder, spellcheck, and name', () => {
		const { getByRole } = render(Textarea, {
			autocomplete: 'on',
			placeholder: 'Type here',
			spellcheck: true,
			name: 'bio'
		});
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.getAttribute('autocomplete')).toBe('on');
		expect(textarea.getAttribute('placeholder')).toBe('Type here');
		expect(textarea.getAttribute('spellcheck')).toBe('true');
		expect(textarea.getAttribute('name')).toBe('bio');
	});

	it('handles maxLength, minLength, and required', () => {
		const { getByRole } = render(Textarea, { maxLength: 100, minLength: 10, required: true });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea.getAttribute('maxlength')).toBe('100');
		expect(textarea.getAttribute('minlength')).toBe('10');
		expect(textarea.required).toBe(true);
	});

	it('applies monospace and invalid styles', () => {
		const { getByRole } = render(Textarea, { monospace: true, invalid: true });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		expect(textarea).toHaveClass('font-mono');
		expect(textarea).toHaveClass('bg-destructive-bg');
	});

	it('applies resize classes correctly', () => {
		const { container: cNone } = render(Textarea, { resize: 'none' });
		expect(cNone.querySelector('textarea')).toHaveClass('resize-none');

		const { container: cBoth } = render(Textarea, { resize: 'both' });
		expect(cBoth.querySelector('textarea')).toHaveClass('resize');

		const { container: cHoriz } = render(Textarea, { resize: 'horizontal' });
		expect(cHoriz.querySelector('textarea')).toHaveClass('resize-x');

		const { container: cVert } = render(Textarea, { resize: 'vertical' });
		expect(cVert.querySelector('textarea')).toHaveClass('resize-y');
	});

	it('fires keyboard and focus events', async () => {
		const onKeyDown = vi.fn();
		const onBlur = vi.fn();
		const onFocus = vi.fn();
		const { getByRole } = render(Textarea, {
			onkeydown: onKeyDown,
			onblur: onBlur,
			onfocus: onFocus
		});
		const textarea = getByRole('textbox') as HTMLTextAreaElement;

		await fireEvent.focus(textarea);
		expect(onFocus).toHaveBeenCalled();

		await fireEvent.keyDown(textarea, { key: 'a' });
		expect(onKeyDown).toHaveBeenCalled();

		await fireEvent.blur(textarea);
		expect(onBlur).toHaveBeenCalled();
	});

	it('sets autofocus attribute', () => {
		const { getByRole } = render(Textarea, { autofocus: true });
		const textarea = getByRole('textbox') as HTMLTextAreaElement;
		// Some test environments don't auto-focus, but the attribute should be there
		expect(textarea.hasAttribute('autofocus')).toBe(true);
	});

	it('applies resize="both" classes', () => {
		const { container } = render(Textarea, { resize: 'both' });
		expect(container.querySelector('*')).toHaveClass('resize');
	});

	it('applies resize="horizontal" classes', () => {
		const { container } = render(Textarea, { resize: 'horizontal' });
		expect(container.querySelector('*')).toHaveClass('resize-x');
	});

	it('applies resize="vertical" classes', () => {
		const { container } = render(Textarea, { resize: 'vertical' });
		expect(container.querySelector('*')).toHaveClass('resize-y');
	});
});
