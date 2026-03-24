import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HoverProvider from './HoverProvider.svelte';

describe('HoverProvider Component', () => {
	it('renders trigger element', () => {
		const { container } = render(HoverProvider);
		const trigger = container.querySelector('[role="group"]');
		expect(trigger).not.toBeNull();
	});

	it('does not show hover content initially', () => {
		const { container } = render(HoverProvider);
		const hover = container.querySelector('[role="complementary"]');
		expect(hover).toBeNull();
	});

	it('accepts position prop', () => {
		const { container } = render(HoverProvider, { position: 'top' });
		expect(container).toBeInTheDocument();
	});

	it('accepts delay prop', () => {
		const { container } = render(HoverProvider, { delay: 500 });
		expect(container).toBeInTheDocument();
	});

	it('accepts instantDelay prop', () => {
		const { container } = render(HoverProvider, { instantDelay: 0 });
		expect(container).toBeInTheDocument();
	});

	it('accepts groupId prop', () => {
		const { container } = render(HoverProvider, { groupId: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts content snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(HoverProvider, { content: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
