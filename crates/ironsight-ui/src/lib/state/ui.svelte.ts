import type { Component } from 'svelte';
import type { TreeNode } from '$lib/components/data-display/AdvancedTreeView.svelte';
import type { EditorTab } from '$lib/components/shell/MultiEditorTabs.svelte';
import { browser } from '$app/environment';

/** A closable tab in the bottom panel. */
export interface PanelTab {
	id: string;
	label: string;
	icon?: Component;
	/** Discriminator for which content to render (e.g. 'featureRegistries'). */
	contentType: string;
	/** Optional payload for content rendering. */
	data?: unknown;
}

class UIState {
	sidebarVisible = $state(true);
	panelVisible = $state(true);
	activeSidebar = $state('explorer');
	sidebarWidth = $state(240);

	// Panel internal status
	panelMaximized = $state(false);
	activePanelTab = $state('terminal');

	// Bottom panel — closable tabs
	panelTabs = $state<PanelTab[]>([]);
	activePanelTabId = $state('');

	// Editor tabs (route-level, top of content area)
	editorTabs = $state<EditorTab[]>([]);
	activeEditorTabId = $state('');

	// Explorer → doc content binding
	activeDocId = $state('');

	// Explorer tree (set by each route page)
	explorerNodes = $state<TreeNode[]>([]);
	selectedNode = $state('');
	expandedIds = $state(new Set<string>());

	// Global Application Error state
	globalError = $state<string | null>(null);
	errorModalOpen = $state(false);

	constructor() {
		if (browser) {
			this.load();
			// Watch for state changes and save
			$effect.root(() => {
				$effect(() => {
					// Track changes to persistent state
					void this.sidebarVisible;
					void this.panelVisible;
					void this.activeSidebar;
					void this.sidebarWidth;
					void this.panelMaximized;
					void this.activePanelTab;
					this.save();
				});
			});
		}
	}

	load() {
		try {
			const stored = localStorage.getItem('qrs-ui-state');
			if (stored) {
				const parsed = JSON.parse(stored);
				if (parsed.sidebarVisible !== undefined) this.sidebarVisible = parsed.sidebarVisible;
				if (parsed.panelVisible !== undefined) this.panelVisible = parsed.panelVisible;
				if (parsed.activeSidebar !== undefined) this.activeSidebar = parsed.activeSidebar;
				if (parsed.sidebarWidth !== undefined) this.sidebarWidth = parsed.sidebarWidth;
				if (parsed.panelMaximized !== undefined) this.panelMaximized = parsed.panelMaximized;
				if (parsed.activePanelTab !== undefined) this.activePanelTab = parsed.activePanelTab;
			}
		} catch (e) {
			console.error('Failed to load UI state from localStorage', e);
		}
	}

	save() {
		if (!browser) return;
		try {
			const toSave = {
				sidebarVisible: this.sidebarVisible,
				panelVisible: this.panelVisible,
				activeSidebar: this.activeSidebar,
				sidebarWidth: this.sidebarWidth,
				panelMaximized: this.panelMaximized,
				activePanelTab: this.activePanelTab
			};
			localStorage.setItem('qrs-ui-state', JSON.stringify(toSave));
		} catch (e) {
			console.error('Failed to save UI state', e);
		}
	}

	toggleSidebar() {
		this.sidebarVisible = !this.sidebarVisible;
	}

	togglePanel() {
		this.panelVisible = !this.panelVisible;
	}

	setSidebar(id: string) {
		if (this.activeSidebar === id && this.sidebarVisible) {
			this.sidebarVisible = false;
		} else {
			this.activeSidebar = id;
			this.sidebarVisible = true;
		}
	}

	/** Open (or focus) a panel tab. If it already exists, just activate it. */
	openPanelTab(tab: PanelTab) {
		const existing = this.panelTabs.find((t) => t.id === tab.id);
		if (!existing) {
			this.panelTabs = [...this.panelTabs, tab];
		}
		this.activePanelTabId = tab.id;
		this.panelVisible = true;
	}

	/** Close a panel tab by id. Adjust active tab if needed. */
	closePanelTab(id: string) {
		const idx = this.panelTabs.findIndex((t) => t.id === id);
		if (idx === -1) return;
		this.panelTabs = this.panelTabs.filter((t) => t.id !== id);
		// If we closed the active tab, activate the nearest remaining tab
		if (this.activePanelTabId === id) {
			const next = this.panelTabs[Math.min(idx, this.panelTabs.length - 1)];
			this.activePanelTabId = next?.id ?? '';
		}
		// If no tabs left, hide the panel
		if (this.panelTabs.length === 0) {
			this.panelVisible = false;
		}
	}

	/** Close all panel tabs. */
	closeAllPanelTabs() {
		this.panelTabs = [];
		this.activePanelTabId = '';
		this.panelVisible = false;
	}

	/** Open (or focus) an editor tab. If it already exists, just activate it. */
	openEditorTab(tab: EditorTab) {
		const existing = this.editorTabs.find((t) => t.id === tab.id);
		if (!existing) {
			this.editorTabs = [...this.editorTabs, tab];
		}
		this.activeEditorTabId = tab.id;
	}

	/** Close an editor tab by id. Adjust active tab if needed. */
	closeEditorTab(id: string) {
		const idx = this.editorTabs.findIndex((t) => t.id === id);
		if (idx === -1) return;
		this.editorTabs = this.editorTabs.filter((t) => t.id !== id);
		if (this.activeEditorTabId === id) {
			const next = this.editorTabs[Math.min(idx, this.editorTabs.length - 1)];
			this.activeEditorTabId = next?.id ?? '';
		}
	}

	/** Open the global error modal with a message */
	showError(message: string) {
		this.globalError = message;
		this.errorModalOpen = true;
	}

	/** Reset the global error state */
	clearError() {
		this.globalError = null;
		this.errorModalOpen = false;
	}
}

export const ui = new UIState();
