import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CommandCenter from './CommandCenter.svelte';

describe('CommandCenter', () => {
	it('renders with combobox role', () => {
		const { getByRole } = render(CommandCenter);
		expect(getByRole('combobox')).toBeInTheDocument();
	});

	it('renders input with label', () => {
		const { getByLabelText } = render(CommandCenter);
		expect(getByLabelText('Command Center')).toBeInTheDocument();
	});

	it('renders custom placeholder', () => {
		const { getByPlaceholderText } = render(CommandCenter, { placeholder: 'Type here...' });
		expect(getByPlaceholderText('Type here...')).toBeInTheDocument();
	});
});
