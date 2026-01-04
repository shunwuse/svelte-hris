<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { Button } from '$lib/components/ui/button';

	let isLoggingOut = $state(false);

	const navItems = [
		{ href: '/' as Pathname, label: 'Dashboard' },
		{ href: '/users' as Pathname, label: 'Users' },
		{ href: '/approvals' as Pathname, label: 'Approvals' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(href);
	}
</script>

<nav class="border-b bg-white">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href={resolve("/")} class="text-xl font-bold text-primary">
				HRIS
			</a>

			<!-- Nav Links -->
			<div class="flex items-center gap-1">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(
							item.href,
							page.url.pathname
						)
							? 'bg-primary/10 text-primary'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- Logout -->
			<form
				method="POST"
				action="/logout"
				use:enhance={() => {
					isLoggingOut = true;
					return async ({ update }) => {
						await update();
					};
				}}
			>
				<Button type="submit" variant="ghost" size="sm" disabled={isLoggingOut}>
					{isLoggingOut ? 'Logging out...' : 'Logout'}
				</Button>
			</form>
		</div>
	</div>
</nav>
