import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FindInput from './FindInput.svelte';

describe('FindInput Component', () => {
	it('renders search input', () => {
		const { container } = render(FindInput);
		const input = container.querySelector('input[type="text"]');
		expect(input).not.toBeNull();
	});

	it('renders match case button', () => {
		const { container } = render(FindInput);
		const btn = container.querySelector('button[title="Match Case"]');
		expect(btn).not.toBeNull();
	});

	it('renders whole word button', () => {
		const { container } = render(FindInput);
		const btn = container.querySelector('button[title="Match Whole Word"]');
		expect(btn).not.toBeNull();
	});

	it('renders regex button', () => {
		const { container } = render(FindInput);
		const btn = container.querySelector('button[title="Use Regular Expression"]');
		expect(btn).not.toBeNull();
	});

	it('applies input token classes', () => {
		const { container } = render(FindInput);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('bg-input');
	});

	it('accepts value prop', () => {
		const { container } = render(FindInput, { value: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts regex prop', () => {
		const { container } = render(FindInput, { regex: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts caseSensitive prop', () => {
		const { container } = render(FindInput, { caseSensitive: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts wholeWord prop', () => {
		const { container } = render(FindInput, { wholeWord: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts placeholder prop', () => {
		const { container } = render(FindInput, { placeholder: 'Search' });
		expect(container).toBeInTheDocument();
	});

	it('fires oninput when typing in the search input', async () => {
		const oninput = vi.fn();
		const { container } = render(FindInput, { oninput });
		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'test' } });
		expect(oninput).toHaveBeenCalled();
	});
});
