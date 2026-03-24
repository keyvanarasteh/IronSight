import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RadioGroup from './RadioGroup.svelte';

describe('RadioGroup Component', () => {
	it('renders correctly with default horizontal variant', () => {
		const { container } = render(RadioGroup);
		const div = container.querySelector('div');
		expect(div).not.toBeNull();
		expect(div!.className).toContain('flex-row');
	});

	it('renders vertical variant', () => {
		const { container } = render(RadioGroup, { variant: 'vertical' });
		const div = container.querySelector('div');
		expect(div!.className).toContain('flex-col');
	});

	it('applies custom class', () => {
		const { container } = render(RadioGroup, { class: 'custom-radio-group' });
		const div = container.querySelector('div');
		expect(div!.className).toContain('custom-radio-group');
	});
});
