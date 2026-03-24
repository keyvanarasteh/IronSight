import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TabHeader from './TabHeader.svelte';

describe('TabHeader Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TabHeader);
		expect(container).toBeTruthy();
	});

	it('accepts contentBefore snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(TabHeader, { contentBefore: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts contentAfter snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(TabHeader, { contentAfter: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
