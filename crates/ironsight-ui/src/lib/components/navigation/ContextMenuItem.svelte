<script lang="ts" module>
	export interface MenuItemData {
		label?: string;
		keybinding?: string;
		value?: string;
		separator?: boolean;
		icon?: import('svelte').Component;
		checked?: boolean;
		disabled?: boolean;
		submenu?: MenuItemData[];
		tabindex?: number;
		[key: string]: unknown;
	}
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import ContextMenuItem from './ContextMenuItem.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		label = '',
		keybinding = '',
		value = '',
		separator = false,
		icon: Icon,
		checked,
		disabled = false,
		submenu,
		selected = false,
		tabindex = 0,
		class: className,
		onselect,
		...rest
	}: {
		children?: Snippet;
		label?: string;
		keybinding?: string;
		value?: string;
		separator?: boolean;
		icon?: import('svelte').Component;
		checked?: boolean;
		disabled?: boolean;
		submenu?: MenuItemData[];
		selected?: boolean;
		tabindex?: number;
		class?: string;
		onselect?: (detail: MenuItemData) => void;
		[key: string]: unknown;
	} = $props();

	let showSubmenu = $state(false);
	let submenuTimer: ReturnType<typeof setTimeout> | null = null;

	function handleClick() {
		if (separator || disabled) return;
		if (submenu && submenu.length > 0) {
			showSubmenu = !showSubmenu;
			return;
		}
		onselect?.({
			label,
			keybinding,
			value: value || label,
			separator,
			tabindex
		});
	}

	function handleMouseEnter() {
		if (submenu && submenu.length > 0) {
			submenuTimer = setTimeout(() => {
				showSubmenu = true;
			}, 200);
		}
	}

	function handleMouseLeave() {
		if (submenuTimer) clearTimeout(submenuTimer);
		submenuTimer = null;
		showSubmenu = false;
	}

	function handleSubmenuSelect(item: MenuItemData) {
		showSubmenu = false;
		onselect?.(item);
	}
</script>

{#if separator}
	<div class={cn('relative m-0 block outline-none', className)} {...rest}>
		<div class="border-menu-border mb-[4px] block w-full border-b border-solid pt-[4px]"></div>
	</div>
{:else}
	<div
		class={cn('relative block outline-none', className)}
		{...rest}
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onclick={handleClick}
	>
		<div
			class="bg-menu-bg text-menu-fg flex font-sans text-[13px] leading-[1.4] font-normal whitespace-nowrap select-none"
		>
			<button
				type="button"
				{disabled}
				class={cn(
					'relative mx-[4px] box-border flex h-[2em] flex-1 cursor-pointer items-center rounded-[3px] border border-solid border-transparent bg-transparent px-[8px] no-underline outline-none',
					selected ? 'bg-menu-selection text-menu-selection-fg border-transparent' : 'text-menu-fg',
					disabled && 'pointer-events-none cursor-default opacity-40'
				)}
			>
				<!-- Check/icon area -->
				<span class="mr-[2px] flex w-[20px] shrink-0 items-center justify-center">
					{#if checked !== undefined}
						{#if checked}
							<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
								<path
									d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
								/>
							</svg>
						{/if}
					{:else if Icon}
						<Icon size={14} />
					{/if}
				</span>

				<!-- Label -->
				{#if label}
					<span class="flex flex-1 bg-none p-0 text-[12px] leading-none">{label}</span>
				{/if}

				<!-- Keybinding -->
				{#if keybinding}
					<span
						class="ml-[22px] block flex-[2_1_auto] p-0 text-right text-[12px] leading-none opacity-60"
						>{keybinding}</span
					>
				{/if}

				<!-- Submenu arrow -->
				{#if submenu && submenu.length > 0}
					<span class="ml-[12px] text-[10px] opacity-60">▶</span>
				{/if}

				{@render children?.()}
			</button>
		</div>

		<!-- Submenu -->
		{#if showSubmenu && submenu && submenu.length > 0}
			<div class="absolute top-0 left-full z-10000">
				<div
					role="menu"
					tabindex="0"
					class="bg-menu-bg border-menu-border text-menu-fg block rounded-[5px] border border-solid py-[4px] font-sans text-[13px] leading-[1.4] whitespace-nowrap shadow-[0_2px_8px_var(--shadow)]"
					style="width: max-content;"
				>
					{#each submenu as subItem, i (i)}
						<ContextMenuItem {...subItem} selected={false} onselect={handleSubmenuSelect} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
