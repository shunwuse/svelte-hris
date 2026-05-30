import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface FlashMessage {
  type: ToastType;
  message: string;
}

// Store for flash messages
const flashStore = writable<FlashMessage | null>(null);

export function handleFlashMessage(message: FlashMessage | null): void {
  if (!message) {
    return;
  }

  switch (message.type) {
    case 'success':
      toast.success(message.message);
      break;
    case 'error':
      toast.error(message.message);
      break;
    case 'warning':
      toast.warning(message.message);
      break;
    case 'info':
      toast.info(message.message);
      break;
  }

  flash.clear();
}

export const flash = {
  subscribe: flashStore.subscribe,
  success: (message: string) => flashStore.set({ type: 'success', message }),
  error: (message: string) => flashStore.set({ type: 'error', message }),
  info: (message: string) => flashStore.set({ type: 'info', message }),
  warning: (message: string) => flashStore.set({ type: 'warning', message }),
  clear: () => flashStore.set(null),
};
