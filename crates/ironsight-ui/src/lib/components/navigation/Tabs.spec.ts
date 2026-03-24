import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TabsTest from './Tabs.spec.svelte';
import Tabs from './Tabs.svelte';

describe('Tabs Component', () => {
	it('switches panels on header click', async () => {
		const { getByText, queryByText } = render(TabsTest);

		expect(getByText('Header 1')).not.toBeNull();
		expect(getByText('Header 2')).not.toBeNull();

		expect(getByText('Panel 1')).not.toBeNull();
		expect(queryByText('Panel 2')).toBeNull(); // It is hidden

		const header2 = getByText('Header 2');
		await fireEvent.click(header2);

		expect(queryByText('Panel 1')).toBeNull();
		expect(getByText('Panel 2')).not.toBeNull();
	});

	it('accepts selectedIndex prop', () => {
		const { container } = render(Tabs, { selectedIndex: 0 });
		expect(container).toBeInTheDocument();
	});

	it('accepts panel prop', () => {
		const { container } = render(Tabs, { panel: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts header snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Tabs, { header: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts addons snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Tabs, { addons: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
