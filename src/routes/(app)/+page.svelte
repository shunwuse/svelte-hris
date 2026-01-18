<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { APPROVAL_STATUS } from '$lib/domain';
	import * as t from '$paraglide/messages';
	import Eye from '@lucide/svelte/icons/eye';
	import Plus from '@lucide/svelte/icons/plus';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Pencil from '@lucide/svelte/icons/pencil';

	let { data } = $props();

	const statusColors = {
		[APPROVAL_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
		[APPROVAL_STATUS.APPROVED]: 'bg-green-100 text-green-800',
		[APPROVAL_STATUS.REJECTED]: 'bg-red-100 text-red-800'
	} as const;
</script>

<div class="p-8">
	<div class="mx-auto max-w-6xl space-y-8">
		<!-- Header -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-gray-900">
					{t['overview.welcome']()}{data.userInfo?.username ? `, ${data.userInfo.username}` : ''}!
				</h1>
				<p class="text-muted-foreground">{t['overview.description']()}</p>
			</div>
			<div class="flex items-center gap-3">
				<Button href={resolve('/approvals/create')} variant="default" class="gap-2">
					<Plus class="size-4" />
					{t['overview.create_request']()}
				</Button>
				<Button href={resolve('/users/create')} variant="outline" class="gap-2">
					<UserPlus class="size-4" />
					{t['overview.create_user']()}
				</Button>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Recent Approvals -->
			<Card>
				<CardHeader class="flex flex-row items-center justify-between">
					<div>
						<CardTitle>{t['overview.recent_approvals']()}</CardTitle>
						<CardDescription>{t['overview.recent_approvals_desc']()}</CardDescription>
					</div>
					<Button href={resolve('/approvals')} variant="ghost" size="sm">{t['overview.view_all']()}</Button>
				</CardHeader>
				<CardContent>
					{#if data.recentApprovals.length === 0}
						<p class="py-4 text-center text-gray-500">{t['overview.no_approvals']()}</p>
					{:else}
						<div class="space-y-3">
							{#each data.recentApprovals as approval (approval.id)}
								<div class="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
									<div>
										<p class="font-medium">{t['approvals.item_title']({ id: approval.id })}</p>
										<p class="text-sm text-gray-500">{t['approvals.creator']()}: {approval.creator_name}</p>
									</div>
									<div class="flex items-center gap-3">
										<Badge class={statusColors[approval.status]}>{approval.status}</Badge>
										<Button
											href={resolve(`/approvals/${approval.id}` as Pathname)}
											size="icon"
											variant="ghost"
											class="h-8 w-8"
										>
											<Eye class="size-4" />
											<span class="sr-only">{t['common.view']()}</span>
										</Button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Recent Users -->
			<Card>
				<CardHeader class="flex flex-row items-center justify-between">
					<div>
						<CardTitle>{t['overview.recent_users']()}</CardTitle>
						<CardDescription>{t['overview.recent_users_desc']()}</CardDescription>
					</div>
					<Button href={resolve('/users')} variant="ghost" size="sm">{t['overview.view_all']()}</Button>
				</CardHeader>
				<CardContent>
					{#if data.recentUsers.length === 0}
						<p class="py-4 text-center text-gray-500">{t['overview.no_users']()}</p>
					{:else}
						<div class="space-y-3">
							{#each data.recentUsers as user (user.id)}
								<div class="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
									<div class="flex items-center gap-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
										>
											{user.username.charAt(0).toUpperCase()}
										</div>
										<div>
											<p class="font-medium">{user.username}</p>
											<p class="text-xs text-gray-500">{user.name}</p>
										</div>
									</div>
									<Button
										href={resolve(`/users/${user.id}` as Pathname)}
										size="icon"
										variant="ghost"
										class="h-8 w-8"
									>
										<Pencil class="size-4" />
										<span class="sr-only">{t['common.edit']()}</span>
									</Button>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	</div>
</div>
