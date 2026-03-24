<script lang="ts" module>
	export type ExpandMode = 'singleClick' | 'doubleClick';
	export type IndentGuideDisplay = 'none' | 'onHover' | 'always';

	export type TreeContextState = {
		expandMode: ExpandMode;
		indent: number;
		indentGuides: IndentGuideDisplay;
		hideArrows: boolean;
		multiSelect: boolean;
		selectedItems: Set<unknown>;
		focusedItem: unknown | null;
		setFocusedItem: (item: unknown) => void;
		handleSelect: (item: unknown, isCtrlDown: boolean, isShiftDown: boolean) => void;
		registerItem: (item: unknown) => void;
		unregisterItem: (item: unknown) => void;
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import { setContext } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { Snippet } from 'svelte';

	let {
		children,
		expandMode = 'singleClick',
		hideArrows = false,
		indent = 8,
		indentGuides = 'onHover',
		multiSelect = false,
		class: className,
		onSelect,
		...rest
	}: {
		children?: Snippet;
		expandMode?: ExpandMode;
		hideArrows?: boolean;
		indent?: number;
		indentGuides?: IndentGuideDisplay;
		multiSelect?: boolean;
		class?: string;
		onSelect?: (items: unknown[]) => void;
		[key: string]: unknown;
	} = $props();

	let items = new SvelteSet<unknown>();
	let selectedItems = new SvelteSet<unknown>();
	let focusedItem = $state<unknown | null>(null);

	function emitSelect() {
		onSelect?.(Array.from(selectedItems));
	}

	const contextState: TreeContextState = {
		get expandMode() {
			return expandMode;
		},
		get indent() {
			return indent;
		},
		get indentGuides() {
			return indentGuides;
		},
		get hideArrows() {
			return hideArrows;
		},
		get multiSelect() {
			return multiSelect;
		},
		get selectedItems() {
			return selectedItems;
		},
		get focusedItem() {
			return focusedItem;
		},
		setFocusedItem(item) {
			focusedItem = item;
		},
		handleSelect(item: unknown, isCtrlDown: boolean, isShiftDown: boolean) {
			// Basic selection logic
			if (multiSelect && isCtrlDown) {
				if (selectedItems.has(item)) {
					selectedItems.delete(item);
				} else {
					selectedItems.add(item);
				}
			} else if (multiSelect && isShiftDown) {
				// Advanced range selection skipped for this simplified implementation
				selectedItems.add(item);
			} else {
				selectedItems.clear();
				selectedItems.add(item);
			}
			emitSelect();
		},
		registerItem(item) {
			items.add(item);
		},
		unregisterItem(item) {
			items.delete(item);
		}
	};

	setContext<TreeContextState>('vscode-tree-root', Object.assign({}, contextState));
	// Setup initial tree level for children to inherit
	setContext('vscode-tree-level', -1);
</script>

<div
	role="tree"
	aria-multiselectable={multiSelect ? 'true' : 'false'}
	class={cn('text-foreground block font-sans text-[13px] font-normal', className)}
	{...rest}
>
	{@render children?.()}
</div>
