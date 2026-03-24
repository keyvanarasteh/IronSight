import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import WindowTitle from './WindowTitle.svelte';

describe('WindowTitle', () => {
	it('renders formatted title with activeEditor', () => {
		const { container } = render(WindowTitle, { activeEditor: 'index.ts', rootName: 'MyProject' });
		const span = container.querySelector('span');
		expect(span).not.toBeNull();
		expect(span!.textContent).toContain('index.ts');
		expect(span!.textContent).toContain('MyProject');
	});

	it('includes prefix and suffix', () => {
		const { container } = render(WindowTitle, {
			activeEditor: 'app.ts',
			prefix: 'Debug',
			suffix: 'VSCode'
		});
		const span = container.querySelector('span');
		expect(span).not.toBeNull();
		expect(span!.textContent).toContain('Debug');
		expect(span!.textContent).toContain('VSCode');
	});
});
