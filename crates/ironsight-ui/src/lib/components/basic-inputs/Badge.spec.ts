import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.svelte';

describe('Badge Component', () => {
	it('renders default variant correctly', () => {
		const { container } = render(Badge);
		const badge = container.firstChild as HTMLElement;
		expect(badge).not.toBeNull();
		expect(badge).toHaveClass('root');
		expect(badge).toHaveClass('bg-badge-bg');
	});

	it('renders counter variant correctly', () => {
		const { container } = render(Badge, { variant: 'counter' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).not.toBeNull();
		expect(badge).toHaveClass('rounded-[11px]');
	});

	it('renders activity-bar-counter variant correctly', () => {
		const { container } = render(Badge, { variant: 'activity-bar-counter' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('bg-activitybar-badge-bg');
	});

	it('renders tab-header-counter variant correctly', () => {
		const { container } = render(Badge, { variant: 'tab-header-counter' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('bg-primary');
	});

	it('renders success variant correctly', () => {
		const { container } = render(Badge, { variant: 'success' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('text-success-500');
	});

	it('renders warning variant correctly', () => {
		const { container } = render(Badge, { variant: 'warning' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('text-warning-500');
	});

	it('renders danger variant correctly', () => {
		const { container } = render(Badge, { variant: 'danger' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('text-danger-500');
	});

	it('renders info variant correctly', () => {
		const { container } = render(Badge, { variant: 'info' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).toHaveClass('text-info-500');
	});

	it('applies custom classes', () => {
		const { container } = render(Badge, { class: 'custom-class' });
		const badge = container.firstChild as HTMLElement;
		expect(badge).not.toBeNull();
		expect(badge).toHaveClass('custom-class');
	});

	it('displays count when provided', () => {
		const { getByText } = render(Badge, { count: 5 });
		expect(getByText('5')).not.toBeNull();
	});

	it('displays count with maxCount logic', () => {
		const { getByText } = render(Badge, { count: 15, maxCount: 10 });
		expect(getByText('10+')).not.toBeNull();
	});

	it('auto-generated test for variant default', () => {
		render(Badge, { variant: 'default' });
	});
});
