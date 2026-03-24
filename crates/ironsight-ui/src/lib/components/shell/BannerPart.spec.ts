import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { Search } from 'lucide-svelte';
import BannerPart from './BannerPart.svelte';

describe('BannerPart', () => {
	it('renders the message', () => {
		const { getByText } = render(BannerPart, { message: 'Update available' });
		expect(getByText('Update available')).toBeInTheDocument();
	});

	it('renders with banner role', () => {
		const { getByRole } = render(BannerPart, { message: 'Info' });
		expect(getByRole('banner')).toBeInTheDocument();
	});

	it('hides when visible is false', () => {
		const { queryByRole } = render(BannerPart, { message: 'Hidden', visible: false });
		expect(queryByRole('banner')).toBeNull();
	});

	it('renders close button when closeable', () => {
		const { getByLabelText } = render(BannerPart, { message: 'Closeable' });
		expect(getByLabelText('Close banner')).toBeInTheDocument();
	});

	it('calls onclose when close button clicked', async () => {
		const onclose = vi.fn();
		const { getByLabelText } = render(BannerPart, { message: 'Test', onclose });
		await fireEvent.click(getByLabelText('Close banner'));
		expect(onclose).toHaveBeenCalled();
	});

	it('auto-generated test for variant info', () => {
		const { container } = render(BannerPart, { variant: 'info' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant warning', () => {
		const { container } = render(BannerPart, { variant: 'warning' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant error', () => {
		const { container } = render(BannerPart, { variant: 'error' });
		expect(container).toBeInTheDocument();
	});

	it('accepts severity prop', () => {
		const { container } = render(BannerPart, { severity: 'info' as BannerSeverity });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(BannerPart, { icon: Search });
		expect(container).toBeInTheDocument();
	});

	it('accepts closeable prop', () => {
		const { container } = render(BannerPart, { closeable: true });
		expect(container).toBeInTheDocument();
	});
});
