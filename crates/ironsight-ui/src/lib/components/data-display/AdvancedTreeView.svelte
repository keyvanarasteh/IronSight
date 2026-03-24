<script lang="ts" module>
	export type TreeNode = {
		id: string;
		label: string;
		icon?: import('$lib/types').IconComponent;
		iconUrl?: string;
		children?: TreeNode[];
		collapsible?: boolean;
		description?: string;
		tooltip?: string;
		checkbox?: boolean;
		checked?: boolean;
		contextValue?: string;
		badges?: { value: string; class?: string }[];
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { ChevronDown, ChevronRight, Check } from 'lucide-svelte';

	let {
		nodes = [] as TreeNode[],
		selected = $bindable(''),
		expandedIds = $bindable(new Set<string>()),
		checkedIds = $bindable(new Set<string>()),
		indent = 16,
		showCheckboxes = false,
		onselect,
		oncheck,
		oncontextmenu,
		itemActions,
		class: className = ''
	}: {
		nodes?: TreeNode[];
		selected?: string;
		expandedIds?: Set<string>;
		checkedIds?: Set<string>;
		indent?: number;
		showCheckboxes?: boolean;
		onselect?: (node: TreeNode) => void;
		oncheck?: (node: TreeNode, checked: boolean) => void;
		oncontextmenu?: (e: MouseEvent, node: TreeNode) => void;
		itemActions?: Snippet<[TreeNode]>;
		class?: string;
	} = $props();

	function toggleExpand(node: TreeNode) {
		const next = new SvelteSet(expandedIds);
		if (next.has(node.id)) {
			next.delete(node.id);
		} else {
			next.add(node.id);
		}
		expandedIds = next;
	}

	function toggleCheck(node: TreeNode) {
		const next = new SvelteSet(checkedIds);
		const isChecked = next.has(node.id);
		if (isChecked) {
			next.delete(node.id);
		} else {
			next.add(node.id);
		}
		checkedIds = next;
		oncheck?.(node, !isChecked);
	}

	function selectNode(node: TreeNode) {
		selected = node.id;
		onselect?.(node);
	}
</script>

{#snippet renderNode(node: TreeNode, depth: number)}
	{@const hasChildren = node.children && node.children.length > 0}
	{@const isExpanded = expandedIds.has(node.id)}
	{@const isSelected = selected === node.id}
	{@const isChecked = checkedIds.has(node.id)}

	<div
		class="group/item flex h-[22px] cursor-pointer items-center text-xs select-none
			{isSelected ? 'bg-list-active-bg text-list-active-fg' : 'hover:bg-list-hover-bg text-foreground'}"
		style="padding-left: {depth * indent}px"
		role="treeitem"
		aria-selected={isSelected}
		aria-expanded={hasChildren ? isExpanded : undefined}
		aria-level={depth + 1}
		title={node.tooltip ?? node.label}
		onclick={() => {
			selectNode(node);
			if (hasChildren) toggleExpand(node);
		}}
		oncontextmenu={(e) => {
			if (oncontextmenu) {
				e.preventDefault();
				oncontextmenu(e, node);
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				selectNode(node);
				if (hasChildren) toggleExpand(node);
			}
		}}
		tabindex="0"
	>
		<!-- Expand arrow -->
		<span class="flex h-4 w-4 shrink-0 items-center justify-center">
			{#if hasChildren}
				{#if isExpanded}
					<ChevronDown class="h-3 w-3" />
				{:else}
					<ChevronRight class="h-3 w-3" />
				{/if}
			{/if}
		</span>

		<!-- Checkbox -->
		{#if showCheckboxes && node.checkbox !== false}
			<button
				class="m-0 mr-1 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border bg-transparent p-0
					{isChecked ? 'border-focusborder bg-focusborder/20' : 'border-input-border'}"
				onclick={(e) => {
					e.stopPropagation();
					(() => toggleCheck(node))();
				}}
				aria-checked={isChecked}
				role="checkbox"
			>
				{#if isChecked}
					<Check class="text-focusborder h-3 w-3" />
				{/if}
			</button>
		{/if}

		<!-- Icon -->
		{#if node.iconUrl}
			<img src={node.iconUrl} alt="" class="mr-1 h-4 w-4 shrink-0" />
		{:else if node.icon}
			<node.icon class="mr-1 h-4 w-4 shrink-0 opacity-80" />
		{/if}

		<!-- Label + description -->
		<span class="flex-1 truncate">{node.label}</span>
		{#if node.description}
			<span class="ml-1 truncate text-[10px] opacity-50">{node.description}</span>
		{/if}

		<!-- Badges -->
		{#if node.badges}
			{#each node.badges as badge, bi (bi)}
				<span
					class="ml-1 rounded-full px-1 py-0 text-[9px] leading-4 {badge.class ??
						'bg-badge-bg text-badge-fg'}"
				>
					{badge.value}
				</span>
			{/each}
		{/if}

		<!-- Inline actions -->
		{#if itemActions}
			<div class="ml-1 flex shrink-0 items-center opacity-0 group-hover/item:opacity-100">
				{@render itemActions(node)}
			</div>
		{/if}
	</div>

	<!-- Children -->
	{#if hasChildren && isExpanded}
		{#each node.children! as child (child.id)}
			{@render renderNode(child, depth + 1)}
		{/each}
	{/if}
{/snippet}

<div class="flex flex-col {className}" role="tree">
	{#each nodes as node (node.id)}
		{@render renderNode(node, 0)}
	{/each}
</div>
