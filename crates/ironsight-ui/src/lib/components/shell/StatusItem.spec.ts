import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import StatusItem from './StatusItem.svelte';
import { Bell } from 'lucide-svelte';

describe('StatusItem', () => {
	it('renders label correctly', () => {
		const { getByText } = render(StatusItem, { label: 'UTF-8' });
		expect(getByText('UTF-8')).toBeInTheDocument();
	});

	it('renders icon if provided', () => {
		const { container } = render(StatusItem, { label: '0', icon: Bell });
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('renders without icon if not provided', () => {
		const { container } = render(StatusItem, { label: 'UTF-8' });
		expect(container.querySelector('svg')).not.toBeInTheDocument();
	});
});
