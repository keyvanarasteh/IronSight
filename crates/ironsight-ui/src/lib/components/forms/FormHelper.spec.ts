import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormHelperTest from './FormHelper.spec.svelte';

describe('FormHelper Component', () => {
	it('renders helper text', () => {
		const { getByText, container } = render(FormHelperTest);
		expect(getByText('Help text here')).not.toBeNull();
		expect(container.querySelector('.vsc-form-helper')).not.toBeNull();
	});
});
