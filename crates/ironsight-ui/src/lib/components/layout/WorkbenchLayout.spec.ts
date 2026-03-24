import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import WorkbenchLayout from './WorkbenchLayout.svelte';

describe('WorkbenchLayout', () => {
	it('renders workbench container', () => {
		const { container } = render(WorkbenchLayout);
		const el = container.querySelector('[data-layout="workbench"]');
		expect(el).not.toBeNull();
	});

	it('applies zen-mode class', () => {
		const { container } = render(WorkbenchLayout, { zenMode: true });
		const el = container.querySelector('[data-layout="workbench"]');
		expect(el).not.toBeNull();
		expect(el!.className).toContain('zen-mode');
	});

	it('accepts sidebarVisible prop', () => {
		const { container } = render(WorkbenchLayout, { sidebarVisible: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts sidebarPosition prop', () => {
		const { container } = render(WorkbenchLayout, { sidebarPosition: 'left' as SidebarPosition });
		expect(container).toBeInTheDocument();
	});

	it('accepts panelVisible prop', () => {
		const { container } = render(WorkbenchLayout, { panelVisible: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts panelPosition prop', () => {
		const { container } = render(WorkbenchLayout, { panelPosition: 'bottom' as PanelPosition });
		expect(container).toBeInTheDocument();
	});

	it('accepts panelMaximized prop', () => {
		const { container } = render(WorkbenchLayout, { panelMaximized: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts auxiliarybarVisible prop', () => {
		const { container } = render(WorkbenchLayout, { auxiliarybarVisible: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts statusbarVisible prop', () => {
		const { container } = render(WorkbenchLayout, { statusbarVisible: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts centeredLayout prop', () => {
		const { container } = render(WorkbenchLayout, { centeredLayout: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts banner snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { banner: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts titlebar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { titlebar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts activitybar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { activitybar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts sidebar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { sidebar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts editor snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { editor: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts panel snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { panel: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts auxiliarybar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { auxiliarybar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});

	it('accepts statusbar snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(WorkbenchLayout, { statusbar: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
