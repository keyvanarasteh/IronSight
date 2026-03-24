import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ToolbarContainer from './ToolbarContainer.svelte';

describe('ToolbarContainer Component', () => {
	it('renders without crashing', () => {
		const { container } = render(ToolbarContainer);
		expect(container).toBeTruthy();
	});
});
