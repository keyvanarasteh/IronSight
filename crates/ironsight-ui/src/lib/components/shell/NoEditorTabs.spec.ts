import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import NoEditorTabs from './NoEditorTabs.svelte';

describe('NoEditorTabs', () => {
	it('renders hidden div', () => {
		const { container } = render(NoEditorTabs);
		const el = container.querySelector('div');
		expect(el).not.toBeNull();
		expect(el!.getAttribute('aria-hidden')).toBe('true');
	});
});
