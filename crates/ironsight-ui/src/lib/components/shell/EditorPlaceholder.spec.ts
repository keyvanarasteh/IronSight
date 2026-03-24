import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EditorPlaceholder from './EditorPlaceholder.svelte';
import { FileQuestion } from 'lucide-svelte';

describe('EditorPlaceholder', () => {
	it('renders default message', () => {
		const { getByText } = render(EditorPlaceholder);
		expect(getByText('This editor could not be opened.')).toBeInTheDocument();
	});

	it('renders custom message', () => {
		const { getByText } = render(EditorPlaceholder, { message: 'File not found' });
		expect(getByText('File not found')).toBeInTheDocument();
	});

	it('has alert role', () => {
		const { getByRole } = render(EditorPlaceholder);
		expect(getByRole('alert')).toBeInTheDocument();
	});

	it('accepts detail prop', () => {
		const { container } = render(EditorPlaceholder, { detail: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(EditorPlaceholder, { icon: FileQuestion });
		expect(container).toBeInTheDocument();
	});
});
