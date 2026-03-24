import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import LabelTest from './Label.spec.svelte';
import Label from './Label.svelte';

describe('Label Component', () => {
	it('renders generic label and required asterisk', () => {
		const { getByText, container } = render(LabelTest);
		const label = getByText('Username');
		expect(label).not.toBeNull();
		// Test required class presence if needed, or just that it renders
		expect(container.querySelector('.after\\:content-\\[\\"_\\*\\"\\]')).not.toBeNull();
	});

	it('accepts for prop', () => {
		const { container } = render(Label, { for: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts required prop', () => {
		const { container } = render(Label, { required: false });
		expect(container).toBeInTheDocument();
	});
});
