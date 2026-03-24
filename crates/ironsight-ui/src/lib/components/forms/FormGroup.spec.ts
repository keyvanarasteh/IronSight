import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormGroupTest from './FormGroup.spec.svelte';
import FormGroup from './FormGroup.svelte';

describe('FormGroup Component', () => {
	it('renders with variants', () => {
		const { getByText } = render(FormGroupTest);
		expect(getByText('Horizontal')).not.toBeNull();
		expect(getByText('Vertical')).not.toBeNull();
		expect(getByText('Settings')).not.toBeNull();
	});

	it('accepts variant prop', () => {
		const { container } = render(FormGroup, { variant: 'horizontal' });
		expect(container).toBeInTheDocument();
	});
});
