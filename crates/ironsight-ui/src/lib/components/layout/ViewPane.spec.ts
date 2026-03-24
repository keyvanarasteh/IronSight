import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ViewPane from './ViewPane.svelte';

describe('ViewPane', () => {
	it('renders region with title', () => {
		const { getByRole } = render(ViewPane, { title: 'Explorer' });
		expect(getByRole('region')).toBeInTheDocument();
	});

	it('renders collapse button', () => {
		const { getByRole } = render(ViewPane, { title: 'Explorer', collapsible: true });
		const btn = getByRole('button');
		expect(btn).toHaveAttribute('aria-expanded', 'true');
	});

	it('toggles expanded state on click', async () => {
		const { getByRole } = render(ViewPane, { title: 'Explorer', collapsible: true });
		const btn = getByRole('button');
		await fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-expanded', 'false');
	});

	it('accepts icon prop', () => {
		const { container } = render(ViewPane, { icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts expanded prop', () => {
		const { container } = render(ViewPane, { expanded: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts headerActions snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(ViewPane, { title: 'Test', headerActions: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts filter snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(ViewPane, { title: 'Test', filter: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
