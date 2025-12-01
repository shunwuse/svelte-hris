<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { flash } from '$lib/stores';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();

	// Watch for flash messages and show toast
	$effect(() => {
		const unsubscribe = flash.subscribe((message) => {
			if (message) {
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
		});

		return unsubscribe;
	});
</script>

<div class="min-h-screen bg-gray-50">
	<Navbar />
	<main>
		{@render children()}
	</main>
</div>
