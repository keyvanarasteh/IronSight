<script lang="ts">
	import { cn } from '../../utils';
	import { getContext, setContext, onMount, onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TreeContextState } from './Tree.svelte';

	let {
		children,
		iconBranch,
		iconBranchOpened,
		iconLeaf,
		description,
		actions,
		decoration,
		nestedItems,
		branch = false,
		open = $bindable(false),
		class: className,
		...rest
	}: {
		children?: Snippet;
		iconBranch?: Snippet;
		iconBranchOpened?: Snippet;
		iconLeaf?: Snippet;
		description?: Snippet;
		actions?: Snippet;
		decoration?: Snippet;
		nestedItems?: Snippet;
		branch?: boolean;
		open?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const tree = getContext<TreeContextState>('vscode-tree-root');
	const parentLevel = getContext<number>('vscode-tree-level') ?? -1;
	const level = parentLevel + 1;

	// Provide our level to any nested tree items
	setContext('vscode-tree-level', level);

	const BASE_INDENT = 3;
	const ARROW_CONTAINER_WIDTH = 30;

	// A unique reference for this item for selection tracking
	const itemRef = {};

	let isSelected = $derived(tree?.selectedItems?.has(itemRef) ?? false);
	let isFocused = $derived(tree?.focusedItem === itemRef);

	onMount(() => {
		tree?.registerItem(itemRef);
	});

	onDestroy(() => {
		tree?.unregisterItem(itemRef);
	});

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		tree?.handleSelect(itemRef, e.ctrlKey || e.metaKey, e.shiftKey);
		tree?.setFocusedItem(itemRef);
		if (tree?.expandMode === 'singleClick' && branch) {
			open = !open;
		}
	}

	function handleDoubleClick(e: MouseEvent) {
		e.stopPropagation();
		if (tree?.expandMode === 'doubleClick' && branch) {
			open = !open;
		}
	}

	let hasVisibleIcon = $derived(
		(branch && iconBranch) || (branch && open && iconBranchOpened) || (!branch && iconLeaf)
	);

	let indentGuides = $derived(tree?.indentGuides ?? 'none');

	let indentation = $derived(BASE_INDENT + level * (tree?.indent ?? 8));
	let guideOffset = $derived(!(tree?.hideArrows ?? false) ? 13 : 3);
	let indentGuideX = $derived(BASE_INDENT + level * (tree?.indent ?? 8) + guideOffset);
	let effectiveIndentation = $derived(
		!branch && !(tree?.hideArrows ?? false) ? indentation + ARROW_CONTAINER_WIDTH : indentation
	);
</script>

<div
	class="root block"
	role="treeitem"
	aria-expanded={branch ? (open ? 'true' : 'false') : null}
	aria-selected={isSelected}
	tabindex={isFocused ? 0 : -1}
	onclick={handleClick}
	ondblclick={handleDoubleClick}
	{...rest}
>
	<div
		class={cn(
			'wrapper text-foreground group/item flex min-h-[22px] cursor-pointer flex-nowrap items-start px-[12px] pr-3 font-sans text-[13px] leading-[22px] -outline-offset-1 outline-none select-none',
			isSelected
				? 'bg-background-selected text-foreground-bright focus:bg-primary-selection focus:text-foreground-bright'
				: 'hover:bg-background-hover hover:text-foreground',
			isFocused ? 'outline-primary outline-1 outline-solid' : '',
			className
		)}
		style="padding-left: {effectiveIndentation}px;"
	>
		<!-- Arrow Container -->
		{#if branch && !(tree?.hideArrows ?? false)}
			<div
				class={cn(
					'arrow-container fill-foreground flex h-[22px] w-[16px] shrink-0 items-center justify-center pr-[6px] pl-[8px]',
					open && 'rotate-90 transform',
					isSelected && 'fill-foreground-bright'
				)}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
					/>
				</svg>
			</div>
		{/if}

		<!-- Icon Container -->
		<div
			class={cn(
				'icon-container mr-[3px] flex min-h-[22px] shrink-0 items-center justify-center overflow-hidden',
				hasVisibleIcon ? 'max-h-[22px] max-w-[22px] min-w-[22px]' : ''
			)}
		>
			{#if branch && !open}
				{@render iconBranch?.()}
			{/if}
			{#if branch && open}
				{@render iconBranchOpened?.()}
			{/if}
			{#if !branch}
				{@render iconLeaf?.()}
			{/if}
		</div>

		<!-- Content Area -->
		<div class="content flex w-full min-w-0 flex-nowrap items-center leading-[22px]">
			<!-- Label -->
			<span
				class="label inline-flex min-w-0 flex-[0_1_auto] items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
			>
				{@render children?.()}
			</span>

			<!-- Description -->
			{#if description}
				<span
					class="description ml-[0.5em] inline-flex min-w-0 flex-[1_1_0%] items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap opacity-70 group-hover/item:opacity-90"
				>
					{@render description()}
				</span>
			{/if}

			<!-- Actions -->
			{#if actions}
				<div
					class="actions ml-auto hidden min-h-[22px] flex-[0_0_auto] items-center gap-[2px] text-inherit group-hover/item:inline-flex"
				>
					{@render actions()}
				</div>
			{/if}

			<!-- Decoration -->
			{#if decoration}
				<div
					class="decoration ml-auto inline-flex min-h-[22px] flex-[0_0_auto] items-center gap-[4px] text-inherit"
				>
					{@render decoration()}
				</div>
			{/if}
		</div>
	</div>

	<!-- Nested Children Container -->
	<!-- We keep it in DOM but display:none if not open to preserve state of nested components -->
	<div
		class={cn(
			'children relative',
			!open && 'hidden',
			indentGuides !== 'none'
				? 'before:bg-indent-guide before:pointer-events-none before:absolute before:top-0 before:z-10 before:block before:h-full before:w-[1px] before:content-[""]'
				: '',
			indentGuides === 'always' ? 'before:block' : '',
			indentGuides === 'onHover' ? 'before:hidden group-hover/item:before:block' : ''
		)}
		style="--indentation-guide-left: {indentGuideX}px; before:left: var(--indentation-guide-left);"
		role="group"
	>
		{@render nestedItems?.()}
	</div>
</div>
