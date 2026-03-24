import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import PageHeader from './PageHeader.svelte';

describe('PageHeader Component', () => {
	it('renders without crashing', () => {
		const { container } = render(PageHeader);
		expect(container).toBeTruthy();
	});

	it('accepts title prop', () => {
		const { container } = render(PageHeader, { title: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts subtitle prop', () => {
		const { container } = render(PageHeader, { subtitle: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(PageHeader, { icon: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts iconClass prop', () => {
		const { container } = render(PageHeader, { iconClass: 'text-qrs-accent' });
		expect(container).toBeInTheDocument();
	});
});
