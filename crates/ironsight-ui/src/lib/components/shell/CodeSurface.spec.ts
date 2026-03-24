import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CodeSurface from './CodeSurface.svelte';

// Note: Testing slot content in Svelte 5 with testing library
// sometimes requires wrapper components. We'll test props for now.
describe('CodeSurface', () => {
	it('renders default number of lines (50)', () => {
		const { container } = render(CodeSurface, {});
		// count div children in the line number column
		const lineCol = container.querySelector('.bg-background.text-right');
		expect(lineCol?.children.length).toBe(50);
	});

	it('renders specified number of lines', () => {
		const { container } = render(CodeSurface, { totalLines: 15 });
		const lineCol = container.querySelector('.bg-background.text-right');
		expect(lineCol?.children.length).toBe(15);
	});

	it('highlights the correct line', () => {
		const { getByText } = render(CodeSurface, { totalLines: 10, highlightedLine: 5 });
		const hlLine = getByText('5');
		expect(hlLine).toHaveClass('text-primary', 'font-bold');
	});
});
