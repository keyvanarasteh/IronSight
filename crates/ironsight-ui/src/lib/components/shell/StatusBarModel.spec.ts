import { describe, it, expect } from 'vitest';
import { createStatusBarModel } from './StatusBarModel.svelte';
import type { StatusBarEntry } from './StatusBarModel.svelte';

describe('StatusBarModel', () => {
	it('creates a status bar model', () => {
		const model = createStatusBarModel();
		expect(model.entries).toEqual([]);
		expect(model.left).toEqual([]);
		expect(model.right).toEqual([]);
	});

	it('adds entries', () => {
		const model = createStatusBarModel();
		const entry: StatusBarEntry = { id: 'branch', text: 'main', alignment: 'left' };
		model.addEntry(entry);
		expect(model.entries).toHaveLength(1);
		expect(model.left).toHaveLength(1);
		expect(model.left[0]!.text).toBe('main');
	});

	it('removes entries', () => {
		const initial: StatusBarEntry[] = [{ id: 'lang', text: 'TS', alignment: 'right' }];
		const model = createStatusBarModel(initial);
		model.removeEntry('lang');
		expect(model.entries).toHaveLength(0);
	});
});
