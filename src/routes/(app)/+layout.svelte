<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<Navbar />
	<main>
		{@render children()}
	</main>
</div>
