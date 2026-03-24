<script lang="ts" module>
	export type StatusBarAlignment = 'left' | 'right';

	export type StatusBarEntry = {
		id: string;
		text: string;
		tooltip?: string;
		alignment: StatusBarAlignment;
		priority?: number;
		visible?: boolean;
		color?: string;
		backgroundColor?: string;
		command?: string;
		onclick?: () => void;
	};

	export function createStatusBarModel(initialEntries: StatusBarEntry[] = []) {
		let entries = $state<StatusBarEntry[]>(initialEntries);

		const left = $derived(
			entries
				.filter((e) => e.alignment === 'left' && e.visible !== false)
				.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
		);

		const right = $derived(
			entries
				.filter((e) => e.alignment === 'right' && e.visible !== false)
				.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
		);

		function addEntry(entry: StatusBarEntry) {
			entries = [...entries, entry];
		}

		function removeEntry(id: string) {
			entries = entries.filter((e) => e.id !== id);
		}

		function updateEntry(id: string, updates: Partial<StatusBarEntry>) {
			entries = entries.map((e) => (e.id === id ? { ...e, ...updates } : e));
		}

		function setVisibility(id: string, visible: boolean) {
			updateEntry(id, { visible });
		}

		return {
			get entries() {
				return entries;
			},
			set entries(v: StatusBarEntry[]) {
				entries = v;
			},
			get left() {
				return left;
			},
			get right() {
				return right;
			},
			addEntry,
			removeEntry,
			updateEntry,
			setVisibility
		};
	}
</script>
