import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ScrollableTest from './Scrollable.spec.svelte';
import Scrollable from './Scrollable.svelte';

describe('Scrollable Component', () => {
	it('renders generic scrolling layout', () => {
		const { container } = render(ScrollableTest);
		const scrollable = container.querySelector('.vscode-scrollable-container');
		expect(scrollable).not.toBeNull();
	});

	it('accepts shadow prop', () => {
		const { container } = render(Scrollable, { shadow: true });
		expect(container).toBeInTheDocument();
	});
});
