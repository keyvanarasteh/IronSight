import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PaneCompositePart from './PaneCompositePart.svelte';

describe('PaneCompositePart', () => {
	it('renders container', () => {
		const { container } = render(PaneCompositePart);
		expect(container.firstElementChild).not.toBeNull();
	});

	it('accepts compositeBar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(PaneCompositePart, { compositeBar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
