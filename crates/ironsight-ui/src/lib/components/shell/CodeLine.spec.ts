import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CodeLine from './CodeLine.svelte';

describe('CodeLine', () => {
	it('renders text with correct color', () => {
		const { getByText } = render(CodeLine, { text: 'const', color: '#569cd6' });
		const element = getByText('const');
		expect(element).toBeInTheDocument();
		expect(element).toHaveStyle('color: #569cd6');
	});
});
