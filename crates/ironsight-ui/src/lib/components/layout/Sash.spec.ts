import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Sash from './Sash.svelte';

describe('Sash Component', () => {
	it('renders separator role', () => {
		const { container } = render(Sash);
		const sep = container.querySelector('[role="separator"]');
		expect(sep).not.toBeNull();
	});

	it('applies vertical cursor by default', () => {
		const { container } = render(Sash);
		const sep = container.querySelector('[role="separator"]');
		expect(sep!).toHaveClass('cursor-ew-resize');
	});

	it('applies horizontal cursor', () => {
		const { container } = render(Sash, { orientation: 'horizontal' });
		const sep = container.querySelector('[role="separator"]');
		expect(sep!).toHaveClass('cursor-ns-resize');
	});

	it('accepts size prop', () => {
		const { container } = render(Sash, { size: 4 });
		expect(container).toBeInTheDocument();
	});

	it('accepts hoverDelay prop', () => {
		const { container } = render(Sash, { hoverDelay: 300 });
		expect(container).toBeInTheDocument();
	});

	it('accepts onchange callback prop', () => {
		const onchange = vi.fn();
		const { container } = render(Sash, { onchange });
		// onchange fires during mouse drag on the separator
		const sep = container.querySelector('[role="separator"]');
		expect(sep).toBeInTheDocument();
	});
});
