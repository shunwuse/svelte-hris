<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import { flash, handleFlashMessage } from '$lib/stores';

  let { children } = $props();

  // Watch for flash messages and show toast
  $effect(() => {
    const unsubscribe = flash.subscribe(handleFlashMessage);

    return unsubscribe;
  });
</script>

<div class="min-h-screen bg-gray-50">
  <Navbar />
  <main>
    {@render children()}
  </main>
</div>
