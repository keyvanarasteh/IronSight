import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import DragAndDrop from './DragAndDrop.svelte';

describe('DragAndDrop Component', () => {
	it('renders without crashing', () => {
		const { container } = render(DragAndDrop);
		expect(container).toBeTruthy();
	});
});
