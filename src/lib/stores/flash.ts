import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface FlashMessage {
	type: ToastType;
	message: string;
}

// Store for flash messages
const flashStore = writable<FlashMessage | null>(null);

export const flash = {
	subscribe: flashStore.subscribe,
	success: (message: string) => flashStore.set({ type: 'success', message }),
	error: (message: string) => flashStore.set({ type: 'error', message }),
	info: (message: string) => flashStore.set({ type: 'info', message }),
	warning: (message: string) => flashStore.set({ type: 'warning', message }),
	clear: () => flashStore.set(null)
};
