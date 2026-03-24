<script lang="ts">
	import type { FileItem } from '../../types';
	import { MoreHorizontal, X, ChevronRight } from 'lucide-svelte';
	import SidebarSection from './SidebarSection.svelte';

	let {
		isOpen,
		isMobileOpen,
		activeSidebar,
		files,
		activeTab,
		onFileClick,
		onClose
	}: {
		isOpen: boolean;
		isMobileOpen: boolean;
		activeSidebar: string;
		files: FileItem[];
		activeTab: string;
		onFileClick: (name: string) => void;
		onClose: () => void;
	} = $props();
</script>

<aside
	class="bg-sidebar border-border absolute z-40 h-full border-r transition-all duration-300 ease-in-out md:relative
	{isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full overflow-hidden md:w-0 md:translate-x-0'}
	{isMobileOpen ? 'w-full translate-x-0' : ''}"
>
	<div class="flex h-full w-72 flex-col md:w-full">
		<div
			class="text-sidebar-foreground flex h-9 items-center justify-between px-5 text-[11px] font-semibold tracking-wide uppercase opacity-50"
		>
			<span>{activeSidebar}</span>
			<div class="flex gap-1">
				<MoreHorizontal class="h-4 w-4 cursor-pointer" />
				<button
					class="text-sidebar-foreground m-0 border-none bg-transparent p-0 md:hidden"
					aria-label="Close"
					onclick={onClose}
				>
					<X class="h-4 w-4 cursor-pointer" />
				</button>
			</div>
		</div>

		<SidebarSection title="PROJECT FILES" open={true}>
			<div class="flex flex-col">
				{#each files as file (file.name)}
					<button
						onclick={() => onFileClick(file.name)}
						class="group relative m-0 flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-5 py-1.5 text-left transition-colors
						{activeTab === file.name
							? 'bg-sidebar-accent text-sidebar-foreground'
							: 'hover:bg-sidebar-accent/50 text-sidebar-foreground/60'}"
					>
						{#if activeTab === file.name}
							<div class="bg-primary absolute left-0 h-full w-[2px]"></div>
						{/if}
						<ChevronRight class="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />
						{#if true}
							{@const Icon = file.icon}
							<Icon
								class="h-4 w-4 {file.lang.includes('JavaScript')
									? 'text-yellow-400'
									: file.lang.includes('TypeScript')
										? 'text-blue-400'
										: 'text-gray-400'}"
							/>
						{/if}
						<span class="truncate">{file.name}</span>
					</button>
				{/each}
			</div>
		</SidebarSection>
		<SidebarSection title="OUTLINE" open={false} />
	</div>
</aside>
