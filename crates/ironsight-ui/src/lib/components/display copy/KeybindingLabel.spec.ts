import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import KeybindingLabel from './KeybindingLabel.svelte';

describe('KeybindingLabel Component', () => {
	it('renders key segments', () => {
		render(KeybindingLabel, { keybinding: 'Ctrl+Shift+P' });
		expect(screen.getByText('Ctrl')).not.toBeNull();
		expect(screen.getByText('Shift')).not.toBeNull();
		expect(screen.getByText('P')).not.toBeNull();
	});

	it('renders mac symbols', () => {
		render(KeybindingLabel, { keybinding: 'Ctrl+Shift+P', os: 'mac' });
		expect(screen.getByText('⌃')).not.toBeNull();
		expect(screen.getByText('⇧')).not.toBeNull();
	});

	it('applies keybinding-fg class', () => {
		const { container } = render(KeybindingLabel, { keybinding: 'Ctrl+S' });
		const el = container.firstChild as HTMLElement;
		expect(el).toHaveClass('text-keybinding-fg');
	});
});
