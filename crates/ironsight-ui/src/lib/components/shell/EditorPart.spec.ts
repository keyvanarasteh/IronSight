import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EditorPart from './EditorPart.svelte';

describe('EditorPart', () => {
	it('renders region with label', () => {
		const { getByRole } = render(EditorPart);
		expect(getByRole('region')).toBeInTheDocument();
	});

	it('has Editor area label', () => {
		const { getByLabelText } = render(EditorPart);
		expect(getByLabelText('Editor area')).toBeInTheDocument();
	});

	it('accepts direction prop', () => {
		const { container } = render(EditorPart, { direction: 'horizontal' as SplitDirection });
		expect(container).toBeInTheDocument();
	});
});
