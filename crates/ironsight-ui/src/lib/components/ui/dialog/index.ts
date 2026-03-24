import { Dialog as DialogPrimitive } from 'bits-ui';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;
const Portal = DialogPrimitive.Portal;

import Title from './dialog-title.svelte';
import Content from './dialog-content.svelte';
import Header from './dialog-header.svelte';
import Footer from './dialog-footer.svelte';
import Description from './dialog-description.svelte';
import Overlay from './dialog-overlay.svelte';

export {
	Root,
	Title,
	Content,
	Description,
	Header,
	Footer,
	Trigger,
	Close,
	Portal,
	Overlay,
	//
	Root as Dialog,
	Title as DialogTitle,
	Content as DialogContent,
	Description as DialogDescription,
	Header as DialogHeader,
	Footer as DialogFooter,
	Trigger as DialogTrigger,
	Close as DialogClose,
	Portal as DialogPortal,
	Overlay as DialogOverlay
};
