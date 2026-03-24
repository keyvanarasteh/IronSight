import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolbarSeparator from './ToolbarSeparator.svelte';

describe('ToolbarSeparator Component', () => {
	it('renders separator role', () => {
		const { container } = render(ToolbarSeparator);
		const sep = container.querySelector('[role="separator"]');
		expect(sep).not.toBeNull();
	});

	it('applies border class', () => {
		const { container } = render(ToolbarSeparator);
		const sep = container.querySelector('[role="separator"]');
		expect(sep!).toHaveClass('bg-border');
	});
});
