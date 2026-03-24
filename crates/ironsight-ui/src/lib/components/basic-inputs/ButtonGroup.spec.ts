import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ButtonGroup from './ButtonGroup.svelte';

describe('ButtonGroup Component', () => {
	it('renders correctly', () => {
		const { container } = render(ButtonGroup);
		const div = container.querySelector('div');
		expect(div).not.toBeNull();
		expect(div!.className).toContain('inline-flex');
	});

	it('applies custom class', () => {
		const { container } = render(ButtonGroup, { class: 'my-custom' });
		const div = container.querySelector('div');
		expect(div!.className).toContain('my-custom');
	});
});
