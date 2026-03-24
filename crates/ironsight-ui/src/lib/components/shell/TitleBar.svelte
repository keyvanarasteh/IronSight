<script lang="ts">
	import { resolve } from '$app/paths';
	import { Menu, Search, Layout, PanelBottom, ChevronDown } from 'lucide-svelte';
	import { page } from '$app/state';
	import Dialog from '$components/overlay/Dialog.svelte';
	import { qrsWebSocket } from '$stores/qrs-websocket.svelte';
	import KeybindingLabel from '$lib/components/display/KeybindingLabel.svelte';

	export type NavMenuItem = {
		label: string;
		href: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
	};

	export type MenuCategory = {
		label: string;
		items: NavMenuItem[];
	};

	let {
		onToggleSidebar,
		onToggleTerminal,
		onToggleMobileMenu,
		workspaceName,
		menuItems
	}: {
		onToggleSidebar: () => void;
		onToggleTerminal: () => void;
		onToggleMobileMenu: () => void;
		workspaceName: string;
		menuItems: MenuCategory[];
	} = $props();

	let openMenuIndex = $state<number | null>(null);
	let hoverIntent = $state(false);

	let aiChatOpen = $state(false);
	let aiChatLoading = $state(false);
	let aiChatResponse = $state('');
	let aiChatError = $state('');

	$effect(() => {
		const unsub = qrsWebSocket.onMessage((msg) => {
			if (!msg || typeof msg !== 'object') return;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const p = msg as any;
			if (p.channel === 'ai.chat') {
				if (p.event === 'chat_token' && p.data) {
					aiChatResponse += p.data.delta ?? '';
					if (p.data.done) {
						aiChatLoading = false;
					}
				} else if (p.event === 'chat_error' && p.data) {
					aiChatError = p.data.error ?? 'Unknown error';
					aiChatLoading = false;
				}
			}
		});
		return () => unsub();
	});

	function handleGlobalKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			aiChatOpen = true;
		}
	}

	function handleAiChatSubmit(result: {
		button: string;
		inputValues: string[];
		checkboxChecked: boolean;
	}) {
		if (result.button === 'Send') {
			const prompt = result.inputValues[0];
			if (prompt && prompt.trim()) {
				aiChatLoading = true;
				aiChatResponse = '';
				aiChatError = '';
				qrsWebSocket.send({
					channel: 'ai.chat',
					event: 'chat_request',
					data: { prompt }
				});

				return false; // prevent immediate close
			}
		} else {
			aiChatLoading = false;
			aiChatResponse = '';
			aiChatError = '';
			// returns undefined -> closes automatically
		}
	}

	function handleMenuEnter(index: number) {
		openMenuIndex = index;
		hoverIntent = true;
	}

	function handleMenuLeave() {
		hoverIntent = false;
		setTimeout(() => {
			if (!hoverIntent) openMenuIndex = null;
		}, 150);
	}

	function handleDropdownEnter() {
		hoverIntent = true;
	}

	function handleDropdownLeave() {
		hoverIntent = false;
		setTimeout(() => {
			if (!hoverIntent) openMenuIndex = null;
		}, 150);
	}

	function handleItemClick() {
		openMenuIndex = null;
		hoverIntent = false;
	}

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		if (href === '/') return path === '/';
		return path === href || path.startsWith(href + '/');
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<header
	data-tauri-drag-region
	class="bg-titlebar-bg text-titlebar-fg border-titlebar-border z-50 flex h-9 items-center justify-between border-b px-3 md:h-10"
>
	<div class="flex items-center gap-2 md:gap-4">
		<button
			class="hover:bg-foreground/10 m-0 cursor-pointer rounded border-none bg-transparent p-1 text-inherit md:hidden"
			onclick={onToggleMobileMenu}
			aria-label="Menu"
		>
			<Menu class="h-5 w-5" />
		</button>
		<div class="hidden items-center gap-3 text-[12px] text-inherit opacity-80 md:flex">
			<svg class="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M23.5 15.4l-3.8-3.8 3.8-3.9c.4-.4.4-1 0-1.4l-2.1-2.1c-.4-.4-1-.4-1.4 0l-5.1 5.1-3-3-1.1 1.1 3 3-5.3 5.3-3.2-3.2-1.1 1.1 3.2 3.2-1.9 1.9c-.4.4-.4 1 0 1.4l2.1 2.1c.4.4 1 .4 1.4 0l3.8-3.8 3.8 3.8c.4.4 1 .4 1.4 0l2.1-2.1c.5-.4.5-1.1.1-1.5z"
				/>
			</svg>
			<div class="hidden gap-0 lg:flex">
				{#each menuItems as category, i (category.label)}
					<div
						class="menu-trigger relative"
						role="menubar"
						tabindex="0"
						onmouseenter={() => handleMenuEnter(i)}
						onmouseleave={handleMenuLeave}
					>
						<button
							class="hover:bg-foreground/10 m-0 flex cursor-pointer items-center gap-0.5 rounded border-none bg-transparent px-2 py-0.5 text-[12px] text-inherit transition-colors
								{openMenuIndex === i ? 'bg-foreground/10' : ''}"
						>
							{category.label}
							<ChevronDown class="h-2.5 w-2.5 opacity-50" />
						</button>

						{#if openMenuIndex === i}
							<div
								class="menu-dropdown border-menu-border bg-menu-bg absolute top-full left-0 z-999 mt-px min-w-[220px] rounded-md border py-1 shadow-2xl"
								role="menu"
								tabindex="-1"
								onmouseenter={handleDropdownEnter}
								onmouseleave={handleDropdownLeave}
							>
								{#each category.items as item (item.href)}
									<a
										href={resolve(item.href as any)}
										onclick={handleItemClick}
										class="hover:bg-menu-selection hover:text-menu-selection-fg flex items-center gap-2.5 px-3 py-[5px] text-[12px] no-underline transition-colors
											{isActive(item.href)
											? 'bg-background-selected text-foreground-bright font-medium'
											: 'text-menu-fg'}"
									>
										{#if item.icon}
											{@const Icon = item.icon}
											<Icon class="h-3.5 w-3.5 shrink-0 opacity-70" />
										{/if}
										<span class="truncate">{item.label}</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="relative mx-4 hidden max-w-xl flex-1 sm:block">
		<button
			onclick={() => (aiChatOpen = true)}
			class="bg-foreground/5 hover:bg-foreground/10 border-titlebar-border relative m-0 flex h-6 w-full cursor-pointer items-center justify-center gap-2 rounded border text-[11px] text-inherit opacity-60 transition-colors hover:opacity-100"
		>
			<Search class="h-3 w-3" />
			<span>{workspaceName}</span>
			<div class="pointer-events-none absolute right-1.5 hidden items-center lg:flex">
				<KeybindingLabel keybinding="Cmd+K" os="mac" />
			</div>
		</button>
	</div>

	<div class="flex items-center gap-2 opacity-80 md:gap-4">
		<div class="flex items-center gap-1 text-inherit md:gap-3">
			<button
				class="m-0 cursor-pointer border-none bg-transparent p-0 text-inherit"
				aria-label="Layout"
				onclick={onToggleSidebar}
			>
				<Layout class="hover:text-foreground h-4 w-4" />
			</button>
			<button
				class="m-0 hidden cursor-pointer border-none bg-transparent p-0 text-inherit sm:block"
				aria-label="Terminal"
				onclick={onToggleTerminal}
			>
				<PanelBottom class="h-4 w-4 hover:text-white" />
			</button>
		</div>
		<div class="ml-2 hidden gap-2 md:flex">
			<div
				class="bg-foreground/20 hover:bg-foreground/30 h-3 w-3 cursor-pointer rounded-full transition-colors"
			></div>
			<div
				class="bg-foreground/20 hover:bg-foreground/30 h-3 w-3 cursor-pointer rounded-full transition-colors"
			></div>
			<div
				class="bg-foreground/20 hover:bg-destructive/80 h-3 w-3 cursor-pointer rounded-full transition-colors"
			></div>
		</div>
	</div>
</header>

<Dialog
	bind:open={aiChatOpen}
	title="AI Chat"
	message="Ask the AI a question or give it a prompt."
	inputs={[{ placeholder: 'Type your message...', type: 'text' }]}
	buttons={[
		{ label: 'Cancel', variant: 'secondary' },
		{ label: 'Send', variant: 'primary' }
	]}
	loading={aiChatLoading}
	onsubmit={handleAiChatSubmit}
>
	{#if aiChatError}
		<div
			class="border-error-border bg-error-bg/10 text-error-fg mt-4 rounded border p-3 text-[12px]"
		>
			{aiChatError}
		</div>
	{:else if aiChatResponse}
		<div
			class="border-foreground/10 bg-foreground/5 text-foreground mt-4 max-h-[300px] overflow-y-auto rounded border p-3 font-mono text-[12px] whitespace-pre-wrap"
		>
			{aiChatResponse}
		</div>
	{/if}
</Dialog>
