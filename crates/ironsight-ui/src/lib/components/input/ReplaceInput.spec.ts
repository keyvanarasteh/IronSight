import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ReplaceInput from './ReplaceInput.svelte';

describe('ReplaceInput Component', () => {
	it('renders two input rows', () => {
		const { container } = render(ReplaceInput);
		const inputs = container.querySelectorAll('input[type="text"]');
		expect(inputs.length).toBe(2);
	});

	it('renders replace button', () => {
		const { container } = render(ReplaceInput);
		const btn = container.querySelector('button[title="Replace"]');
		expect(btn).not.toBeNull();
	});

	it('renders replace all button', () => {
		const { container } = render(ReplaceInput);
		const btn = container.querySelector('button[title="Replace All"]');
		expect(btn).not.toBeNull();
	});

	it('accepts value prop', () => {
		const { container } = render(ReplaceInput, { value: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts replaceValue prop', () => {
		const { container } = render(ReplaceInput, { replaceValue: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts regex prop', () => {
		const { container } = render(ReplaceInput, { regex: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts caseSensitive prop', () => {
		const { container } = render(ReplaceInput, { caseSensitive: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts wholeWord prop', () => {
		const { container } = render(ReplaceInput, { wholeWord: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts preserveCase prop', () => {
		const { container } = render(ReplaceInput, { preserveCase: false });
		expect(container).toBeInTheDocument();
	});

	it('fires oninput when typing in the search input', async () => {
		const oninput = vi.fn();
		const { container } = render(ReplaceInput, { oninput });
		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'test' } });
		expect(oninput).toHaveBeenCalled();
	});

	it('fires onreplace when Replace button is clicked', async () => {
		const onreplace = vi.fn();
		const { container } = render(ReplaceInput, { onreplace });
		const btn = container.querySelector('button[title="Replace"]') as HTMLElement;
		if (btn) await fireEvent.click(btn);
		expect(onreplace).toHaveBeenCalled();
	});

	it('fires onreplaceall when Replace All button is clicked', async () => {
		const onreplaceall = vi.fn();
		const { container } = render(ReplaceInput, { onreplaceall });
		const btn = container.querySelector('button[title="Replace All"]') as HTMLElement;
		if (btn) await fireEvent.click(btn);
		expect(onreplaceall).toHaveBeenCalled();
	});
});
