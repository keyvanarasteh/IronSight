import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TitleBar from './TitleBar.svelte';

describe('TitleBar', () => {
	const props = {
		onToggleSidebar: vi.fn(),
		onToggleTerminal: vi.fn(),
		onToggleMobileMenu: vi.fn(),
		workspaceName: 'Test Workspace',
		menuItems: [
			{
				label: 'Home',
				items: [
					{ label: 'Dashboard', href: '/' },
					{ label: 'App', href: '/app' }
				]
			},
			{
				label: 'Tools',
				items: [{ label: 'Settings', href: '/settings' }]
			}
		]
	};

	it('renders workspace name and menu categories', () => {
		const { getByText } = render(TitleBar, props);
		expect(getByText('Test Workspace')).toBeInTheDocument();
		expect(getByText('Home')).toBeInTheDocument();
		expect(getByText('Tools')).toBeInTheDocument();
	});

	it('handles toggle actions', async () => {
		const { getByLabelText } = render(TitleBar, props);

		await fireEvent.click(getByLabelText('Menu'));
		expect(props.onToggleMobileMenu).toHaveBeenCalledOnce();

		await fireEvent.click(getByLabelText('Layout'));
		expect(props.onToggleSidebar).toHaveBeenCalledOnce();

		await fireEvent.click(getByLabelText('Terminal'));
		expect(props.onToggleTerminal).toHaveBeenCalledOnce();
	});

	it('accepts workspaceName prop', () => {
		const { container } = render(TitleBar, { workspaceName: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts menuItems prop', () => {
		const { container } = render(TitleBar, { menuItems: [] });
		expect(container).toBeInTheDocument();
	});
});
