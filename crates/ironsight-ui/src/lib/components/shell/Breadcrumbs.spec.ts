import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Breadcrumbs from './Breadcrumbs.svelte';

describe('Breadcrumbs', () => {
	it('renders all segments', () => {
		const segments = ['src', 'components', 'App.svelte'];
		const { getByText } = render(Breadcrumbs, { segments });

		expect(getByText('src')).toBeInTheDocument();
		expect(getByText('components')).toBeInTheDocument();
		expect(getByText('App.svelte')).toBeInTheDocument();
	});

	it('styles last segment uniquely', () => {
		const segments = ['src', 'App.svelte'];
		const { getByText } = render(Breadcrumbs, { segments });

		const lastSegment = getByText('App.svelte');
		expect(lastSegment).toHaveClass('text-foreground/80');
	});

	it('accepts segments prop', () => {
		const { container } = render(Breadcrumbs, { segments: 'test-value' });
		expect(container).toBeInTheDocument();
	});
});
