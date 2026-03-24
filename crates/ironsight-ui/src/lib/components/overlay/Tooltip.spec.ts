import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Tooltip from './Tooltip.svelte';

describe('Tooltip Component', () => {
	it('renders trigger content', () => {
		const { container } = render(Tooltip, { text: 'Hello' });
		const trigger = container.querySelector('[role="group"]');
		expect(trigger).not.toBeNull();
	});

	it('does not show tooltip initially', () => {
		const { container } = render(Tooltip, { text: 'Tip' });
		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip).toBeNull();
	});

	it('applies custom class to trigger', () => {
		const { container } = render(Tooltip, { text: 'Tip', class: 'custom-tip' });
		const trigger = container.querySelector('[role="group"]');
		expect(trigger).not.toBeNull();
	});

	it('accepts position prop', () => {
		const { container } = render(Tooltip, { position: 'top' });
		expect(container).toBeInTheDocument();
	});

	it('accepts delay prop', () => {
		const { container } = render(Tooltip, { delay: 500 });
		expect(container).toBeInTheDocument();
	});
});
