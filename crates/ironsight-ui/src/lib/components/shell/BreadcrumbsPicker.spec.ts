import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import BreadcrumbsPicker from './BreadcrumbsPicker.svelte';

describe('BreadcrumbsPicker', () => {
	it('renders breadcrumb nav', () => {
		const { getByRole } = render(BreadcrumbsPicker, {
			segments: [{ label: 'src' }, { label: 'lib' }, { label: 'index.ts' }]
		});
		expect(getByRole('navigation')).toBeInTheDocument();
	});

	it('renders segment labels', () => {
		const { getByText } = render(BreadcrumbsPicker, {
			segments: [{ label: 'src' }, { label: 'lib' }]
		});
		expect(getByText('src')).toBeInTheDocument();
		expect(getByText('lib')).toBeInTheDocument();
	});
});
