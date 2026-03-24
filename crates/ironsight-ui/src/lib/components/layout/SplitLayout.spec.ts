import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SplitLayoutTest from './SplitLayout.spec.svelte';
import SplitLayout from './SplitLayout.svelte';

describe('SplitLayout Component', () => {
	it('renders start and end panes', () => {
		const { getByText } = render(SplitLayoutTest);
		expect(getByText('Start Pane')).not.toBeNull();
		expect(getByText('End Pane')).not.toBeNull();
	});

	it('accepts split prop', () => {
		const { container } = render(SplitLayout, { split: 'vertical' });
		expect(container).toBeInTheDocument();
	});

	it('accepts resetOnDblClick prop', () => {
		const { container } = render(SplitLayout, { resetOnDblClick: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts handleSize prop', () => {
		const { container } = render(SplitLayout, { handleSize: 4 });
		expect(container).toBeInTheDocument();
	});

	it('accepts initialHandlePosition prop', () => {
		const { container } = render(SplitLayout, { initialHandlePosition: '50%' });
		expect(container).toBeInTheDocument();
	});

	it('accepts fixedPane prop', () => {
		const { container } = render(SplitLayout, { fixedPane: 'none' });
		expect(container).toBeInTheDocument();
	});

	it('accepts minStart prop', () => {
		const { container } = render(SplitLayout, { minStart: '0px' });
		expect(container).toBeInTheDocument();
	});

	it('accepts minEnd prop', () => {
		const { container } = render(SplitLayout, { minEnd: '0px' });
		expect(container).toBeInTheDocument();
	});

	it('accepts start snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(SplitLayout, { start: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts end snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(SplitLayout, { end: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
