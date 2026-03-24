<script lang="ts" module>
	export type DragData = {
		type: 'editor' | 'file' | 'view' | 'composite';
		id: string;
		label?: string;
		sourceGroup?: string;
		data?: unknown;
	};

	export const DRAG_MIME = 'application/qix-drag';

	export function setDragData(e: DragEvent, data: DragData) {
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData(DRAG_MIME, JSON.stringify(data));
			e.dataTransfer.setData('text/plain', data.label ?? data.id);
		}
	}

	export function getDragData(e: DragEvent): DragData | null {
		const raw = e.dataTransfer?.getData(DRAG_MIME);
		if (!raw) return null;
		try {
			return JSON.parse(raw) as DragData;
		} catch {
			return null;
		}
	}

	export function hasDragData(e: DragEvent): boolean {
		return e.dataTransfer?.types.includes(DRAG_MIME) ?? false;
	}
</script>
