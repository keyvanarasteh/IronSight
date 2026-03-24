import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PrimarySidebar from './PrimarySidebar.svelte';
import { FileCode } from 'lucide-svelte';
import type { FileItem } from '../../types';

describe('PrimarySidebar', () => {
	const files: FileItem[] = [{ name: 'App.svelte', icon: FileCode, lang: 'Svelte' }];

	const props = {
		isOpen: true,
		isMobileOpen: false,
		activeSidebar: 'EXPLORER',
		files,
		activeTab: 'App.svelte',
		onFileClick: vi.fn(),
		onClose: vi.fn()
	};

	it('renders title and files', () => {
		const { getByText } = render(PrimarySidebar, props);
		expect(getByText('EXPLORER')).toBeInTheDocument();
		expect(getByText('PROJECT FILES')).toBeInTheDocument();
		expect(getByText('App.svelte')).toBeInTheDocument();
	});

	it('hides when closed', () => {
		const { container } = render(PrimarySidebar, { ...props, isOpen: false });
		const aside = container.querySelector('aside');
		expect(aside).toBeTruthy();
		expect(aside!).toHaveClass('w-0');
	});

	it('calls onFileClick', async () => {
		const { getByText } = render(PrimarySidebar, props);
		await fireEvent.click(getByText('App.svelte'));
		expect(props.onFileClick).toHaveBeenCalledWith('App.svelte');
	});

	it('calls onClose on mobile close button', async () => {
		const { getByLabelText } = render(PrimarySidebar, props);
		await fireEvent.click(getByLabelText('Close'));
		expect(props.onClose).toHaveBeenCalledOnce();
	});

	it('accepts isMobileOpen prop', () => {
		const { container } = render(PrimarySidebar, { isMobileOpen: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts activeSidebar prop', () => {
		const { container } = render(PrimarySidebar, { activeSidebar: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts files prop', () => {
		const { container } = render(PrimarySidebar, { files: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts activeTab prop', () => {
		const { container } = render(PrimarySidebar, { activeTab: 'test-value' });
		expect(container).toBeInTheDocument();
	});
});
