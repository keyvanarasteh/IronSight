import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ResourceLabels from './ResourceLabels.svelte';

describe('ResourceLabels', () => {
	it('renders file name', () => {
		const { getByText } = render(ResourceLabels, { path: 'src/lib/index.ts' });
		expect(getByText('index.ts')).toBeInTheDocument();
	});

	it('renders medium format', () => {
		const { getByText } = render(ResourceLabels, { path: 'src/lib/index.ts', format: 'medium' });
		expect(getByText(/index\.ts.*src\/lib/)).toBeInTheDocument();
	});

	it('renders decoration', () => {
		const { getByText } = render(ResourceLabels, {
			name: 'file.ts',
			decoration: { letter: 'M', color: 'green', tooltip: 'Modified' }
		});
		expect(getByText('M')).toBeInTheDocument();
	});
});
