<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { Button } from '$lib/components/ui/button';
	import * as t from '$paraglide/messages';
	import { locales, setLocale, getLocale } from '$paraglide/runtime';
	import * as Select from '$lib/components/ui/select';
	import Languages from '@lucide/svelte/icons/languages';

	let isLoggingOut = $state(false);

	const navItems = $derived([
		{ href: '/' as Pathname, label: t['nav.overview']() },
		{ href: '/users' as Pathname, label: t['nav.users']() },
		{ href: '/approvals' as Pathname, label: t['nav.approvals']() }
	]);

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') {
			return pathname === '/';
		}
		return pathname.startsWith(href);
	}

	const localeNames: Record<string, string> = {
		en: 'English',
		'zh-TW': '繁體中文'
	};
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

			<div class="flex items-center gap-4">
				<!-- Language Switcher -->
				<Select.Root
					type="single"
					value={getLocale()}
					onValueChange={(value) => {
						if (value) setLocale(value as (typeof locales)[number]);
					}}
				>
					<Select.Trigger class="h-9 w-[130px] border-none bg-transparent hover:bg-gray-100">
						<div class="flex items-center gap-2">
							<Languages class="size-4 text-muted-foreground" />
							<span class="text-sm font-medium">
								{localeNames[getLocale()]}
							</span>
						</div>
					</Select.Trigger>
					<Select.Content align="end">
						{#each locales as locale (locale)}
							<Select.Item value={locale} class="text-sm">
								{localeNames[locale]}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

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
						{isLoggingOut ? t['nav.logging_out']() : t['nav.logout']()}
					</Button>
				</form>
			</div>
		</div>
	</div>
</nav>
