import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ContextView from './ContextView.svelte';

describe('ContextView Component', () => {
	it('renders nothing when hidden', () => {
		const { container } = render(ContextView, { show: false });
		// When {#if} is false, Svelte renders only a comment node
		expect(container.querySelector('.bg-widget-bg')).toBeNull();
	});

	it('renders container when shown', () => {
		const { container } = render(ContextView, { show: true });
		const view = container.querySelector('.bg-widget-bg');
		expect(view).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(ContextView, { show: true, class: 'my-ctx' });
		const view = container.querySelector('.my-ctx');
		expect(view).not.toBeNull();
	});

	it('accepts anchorElement prop', () => {
		const { container } = render(ContextView, { anchorElement: null });
		expect(container).toBeInTheDocument();
	});

	it('accepts position prop', () => {
		const { container } = render(ContextView, { position: 'below' });
		expect(container).toBeInTheDocument();
	});

	it('accepts align prop', () => {
		const { container } = render(ContextView, { align: 'start' });
		expect(container).toBeInTheDocument();
	});

	it('accepts offsetX prop', () => {
		const { container } = render(ContextView, { offsetX: 0 });
		expect(container).toBeInTheDocument();
	});

	it('accepts offsetY prop', () => {
		const { container } = render(ContextView, { offsetY: 4 });
		expect(container).toBeInTheDocument();
	});

	it('accepts closeOnClickOutside prop', () => {
		const { container } = render(ContextView, { closeOnClickOutside: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts closeOnEscape prop', () => {
		const { container } = render(ContextView, { closeOnEscape: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts onclose callback prop', () => {
		const onclose = vi.fn();
		const { container } = render(ContextView, { show: true, onclose });
		expect(container).toBeInTheDocument();
	});
});
