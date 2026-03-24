import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ViewFilter from './ViewFilter.svelte';

describe('ViewFilter', () => {
	it('renders search role', () => {
		const { getByRole } = render(ViewFilter);
		expect(getByRole('search')).toBeInTheDocument();
	});

	it('renders input', () => {
		const { container } = render(ViewFilter, { placeholder: 'Filter...' });
		const input = container.querySelector('input');
		expect(input).not.toBeNull();
		expect(input!.placeholder).toBe('Filter...');
	});

	it('accepts value prop', () => {
		const { container } = render(ViewFilter, { value: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts showFilterButton prop', () => {
		const { container } = render(ViewFilter, { showFilterButton: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts filterActive prop', () => {
		const { container } = render(ViewFilter, { filterActive: false });
		expect(container).toBeInTheDocument();
	});

	it('fires onfilter when input changes', async () => {
		const onfilter = vi.fn();
		const { container } = render(ViewFilter, { onfilter });
		const input = container.querySelector('input') as HTMLInputElement;
		if (input) await fireEvent.input(input, { target: { value: 'test' } });
		expect(onfilter).toHaveBeenCalled();
	});
});
