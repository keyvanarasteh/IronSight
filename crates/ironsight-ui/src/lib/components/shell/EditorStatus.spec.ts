import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import EditorStatus from './EditorStatus.svelte';

describe('EditorStatus', () => {
	it('renders language', () => {
		const { getByText } = render(EditorStatus, { language: 'TypeScript' });
		expect(getByText('TypeScript')).toBeInTheDocument();
	});

	it('renders cursor position', () => {
		const { getByText } = render(EditorStatus, { line: 42, column: 7 });
		expect(getByText('Ln 42, Col 7')).toBeInTheDocument();
	});

	it('renders encoding and eol', () => {
		const { getByText } = render(EditorStatus, { encoding: 'UTF-8', eol: 'LF' });
		expect(getByText('UTF-8')).toBeInTheDocument();
		expect(getByText('LF')).toBeInTheDocument();
	});

	it('has status role', () => {
		const { getByRole } = render(EditorStatus);
		expect(getByRole('status')).toBeInTheDocument();
	});

	it('accepts selected prop', () => {
		const { container } = render(EditorStatus, { selected: 0 });
		expect(container).toBeInTheDocument();
	});

	it('accepts Spaces prop', () => {
		const { container } = render(EditorStatus, { Spaces: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts notifications prop', () => {
		const { container } = render(EditorStatus, { notifications: 0 });
		expect(container).toBeInTheDocument();
	});
});
