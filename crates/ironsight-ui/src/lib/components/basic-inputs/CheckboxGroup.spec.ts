import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CheckboxGroup from './CheckboxGroup.svelte';

describe('CheckboxGroup Component', () => {
	it('renders correctly with default horizontal variant', () => {
		const { container } = render(CheckboxGroup);
		const div = container.querySelector('div');
		expect(div).not.toBeNull();
		expect(div!.className).toContain('flex-row');
	});

	it('renders vertical variant', () => {
		const { container } = render(CheckboxGroup, { variant: 'vertical' });
		const div = container.querySelector('div');
		expect(div!.className).toContain('flex-col');
	});

	it('applies custom class', () => {
		const { container } = render(CheckboxGroup, { class: 'custom-group' });
		const div = container.querySelector('div');
		expect(div!.className).toContain('custom-group');
	});
});
