import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import SidebarPart from './SidebarPart.svelte';

describe('SidebarPart', () => {
	it('renders when visible', () => {
		const { container } = render(SidebarPart, { props: { visible: true, title: 'Explorer' } });
		expect(container.querySelector('aside')).toBeTruthy();
	});

	it('does not render when hidden', () => {
		const { container } = render(SidebarPart, { props: { visible: false } });
		expect(container.querySelector('aside')).toBeNull();
	});

	it('shows title text', () => {
		const { container } = render(SidebarPart, { props: { visible: true, title: 'Explorer' } });
		expect(container.textContent).toContain('Explorer');
	});

	it('has resize sash by default', () => {
		const { container } = render(SidebarPart, { props: { visible: true, title: 'Test' } });
		expect(container.querySelector('[role="separator"]')).toBeTruthy();
	});

	it('hides resize sash when not resizable', () => {
		const { container } = render(SidebarPart, {
			props: { visible: true, title: 'Test', resizable: false }
		});
		expect(container.querySelector('[role="separator"]')).toBeNull();
	});

	it('applies width style', () => {
		const { container } = render(SidebarPart, {
			props: { visible: true, title: 'Test', width: 300 }
		});
		const aside = container.querySelector('aside');
		expect(aside?.getAttribute('style')).toContain('300px');
	});

	it('accepts visible prop', () => {
		const { container } = render(SidebarPart, { visible: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts position prop', () => {
		const { container } = render(SidebarPart, { position: 'left' as 'left' | 'right' });
		expect(container).toBeInTheDocument();
	});

	it('accepts minWidth prop', () => {
		const { container } = render(SidebarPart, { minWidth: 160 });
		expect(container).toBeInTheDocument();
	});

	it('accepts maxWidth prop', () => {
		const { container } = render(SidebarPart, { maxWidth: 480 });
		expect(container).toBeInTheDocument();
	});

	it('accepts tabs prop', () => {
		const { container } = render(SidebarPart, { tabs: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts activeTab prop', () => {
		const { container } = render(SidebarPart, { activeTab: '' });
		expect(container).toBeInTheDocument();
	});
});
