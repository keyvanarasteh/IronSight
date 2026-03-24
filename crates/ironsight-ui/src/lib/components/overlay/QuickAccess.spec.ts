import { describe, it, expect, fireEvent } from 'vitest';
import { render } from '@testing-library/svelte';
import QuickAccess from './QuickAccess.svelte';

describe('QuickAccess', () => {
	it('does not render when not visible', () => {
		const { queryByRole } = render(QuickAccess, { visible: false });
		expect(queryByRole('combobox')).toBeNull();
	});

	it('renders combobox when visible', () => {
		const { getByRole } = render(QuickAccess, { visible: true });
		expect(getByRole('combobox')).toBeInTheDocument();
	});

	it('renders input with label', () => {
		const { getByLabelText } = render(QuickAccess, { visible: true });
		expect(getByLabelText('Quick Access Input')).toBeInTheDocument();
	});

	it('renders listbox with items', () => {
		const { getByRole, getAllByRole } = render(QuickAccess, {
			visible: true,
			items: [{ label: 'Open File' }, { label: 'Close Editor' }]
		});
		expect(getByRole('listbox')).toBeInTheDocument();
		expect(getAllByRole('option')).toHaveLength(2);
	});

	it('accepts placeholder prop', () => {
		const { container } = render(QuickAccess, { placeholder: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts prefix prop', () => {
		const { container } = render(QuickAccess, { prefix: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts value prop', () => {
		const { container } = render(QuickAccess, { value: '' });
		expect(container).toBeInTheDocument();
	});
});
