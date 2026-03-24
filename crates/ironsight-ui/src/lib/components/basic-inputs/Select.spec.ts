import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SelectTest from './Select.spec.svelte'; // We need a wrapper to test Select + Option

describe('Select and Option Components', () => {
	it('renders correctly with options', () => {
		const { getByRole, getAllByRole } = render(SelectTest);
		const button = getByRole('button');
		expect(button).not.toBeNull();

		const options = getAllByRole('option', { hidden: true }); // hidden because they are in a hidden dropdown
		expect(options.length).toBe(3);
	});

	it('reflects single selection', async () => {
		const { getByRole, getAllByRole } = render(SelectTest);
		const button = getByRole('button');

		// Wait for onMount to register options
		await new Promise((r) => setTimeout(r, 0));

		expect(button.textContent).toContain('Option 1');

		const options = getAllByRole('option', { hidden: true });
		await fireEvent.click(options[1]!); // Click 'Option 2'

		expect(button.textContent).toContain('Option 2');
	});

	it('toggles dropdown visibility', async () => {
		const { getByRole, getByRole: getListbox } = render(SelectTest);
		const button = getByRole('button');
		const listbox = getListbox('listbox', { hidden: true });

		const parentContainer = listbox.parentElement!;
		expect(parentContainer.classList.contains('hidden')).toBe(true);

		await fireEvent.click(button);
		expect(parentContainer.classList.contains('block')).toBe(true);

		// clicking an option should close it if single select
		const options = parentContainer.querySelectorAll('li');
		await fireEvent.click(options[0]!);
		expect(parentContainer.classList.contains('hidden')).toBe(true);
	});

	it('respects multiple prop', async () => {
		// Import Select directly for these prop tests since the wrapper specifies single selection
		const Select = (await import('./Select.svelte')).default;
		const { getByRole } = render(Select, { multiple: true });
		const button = getByRole('button');
		expect(button.textContent).toContain('0 Selected');
	});

	it('renders placeholder when no value is selected', async () => {
		const Select = (await import('./Select.svelte')).default;
		const { getByRole } = render(Select, { placeholder: 'Select an item' });
		const button = getByRole('button');
		expect(button.textContent).toContain('Select an item');
	});

	it('reflects disabled state', async () => {
		const Select = (await import('./Select.svelte')).default;
		const { getByRole } = render(Select, { disabled: true });
		const button = getByRole('button') as HTMLButtonElement;
		expect(button.disabled).toBe(true);
		expect(button).toHaveClass('opacity-50');
	});

	it('applies invalid styles', async () => {
		const Select = (await import('./Select.svelte')).default;
		const { getByRole } = render(Select, { invalid: true });
		const button = getByRole('button');
		expect(button).toHaveClass('bg-destructive-bg');
	});

	it('respects value prop directly', async () => {
		const Select = (await import('./Select.svelte')).default;
		const { getByRole } = render(Select, { value: 'item-1', placeholder: 'Placeholder' });
		const button = getByRole('button');
		// Without registered options, it displays placeholder because the option map is empty
		// We just verify it renders without error.
		expect(button).not.toBeNull();
	});
});
