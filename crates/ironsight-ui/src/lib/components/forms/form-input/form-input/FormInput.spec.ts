import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FormInput from './FormInput.svelte';
import { Search } from 'lucide-svelte';

describe('FormInput Component', () => {
	it('renders without crashing', () => {
		const { container } = render(FormInput);
		expect(container).toBeTruthy();
	});

	it('accepts value prop', () => {
		const { container } = render(FormInput, { value: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts type prop', () => {
		const { container } = render(FormInput, { type: 'text' });
		expect(container).toBeInTheDocument();
	});

	it('accepts placeholder prop', () => {
		const { container } = render(FormInput, { placeholder: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts label prop', () => {
		const { container } = render(FormInput, { label: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts error prop', () => {
		const { container } = render(FormInput, { error: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts hint prop', () => {
		const { container } = render(FormInput, { hint: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts leadingIcon prop', () => {
		const { container } = render(FormInput, { leadingIcon: Search });
		expect(container).toBeInTheDocument();
	});

	it('accepts trailingIcon prop', () => {
		const { container } = render(FormInput, { trailingIcon: Search });
		expect(container).toBeInTheDocument();
	});

	it('accepts disabled prop', () => {
		const { container } = render(FormInput, { disabled: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts size prop', () => {
		const { container } = render(FormInput, { size: 'md' });
		expect(container).toBeInTheDocument();
	});
});
