<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	const statusColors = {
		PENDING: 'bg-yellow-100 text-yellow-800',
		APPROVED: 'bg-green-100 text-green-800',
		REJECTED: 'bg-red-100 text-red-800'
	} as const;
</script>

<div class="p-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">
				Welcome back{data.userInfo?.username ? `, ${data.userInfo.username}` : ''}!
			</h1>
			<p class="mt-1 text-gray-500">Here's what's happening in your HRIS system.</p>
		</div>

		<!-- User Profile Card -->
		{#if data.userInfo}
			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Your Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="flex items-center gap-4">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
						>
							{data.userInfo.username?.charAt(0).toUpperCase() ?? '?'}
						</div>
						<div>
							<p class="text-xl font-medium">{data.userInfo.username}</p>
							{#if data.userInfo.roles}
								<div class="mt-1 flex gap-2">
									{#each data.userInfo.roles as role (role)}
										<Badge variant="secondary">{role}</Badge>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Stats Cards -->
		<div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<a href="/users" class="block">
				<Card
					class="cursor-pointer transition-all hover:border-primary hover:shadow-md"
				>
					<CardHeader class="pb-2">
						<CardDescription>Total Users</CardDescription>
						<CardTitle class="text-3xl">{data.stats.totalUsers}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-xs text-muted-foreground">Registered in system →</p>
					</CardContent>
				</Card>
			</a>

			<a href="/approvals?status=PENDING" class="block">
				<Card
					class="cursor-pointer transition-all hover:border-yellow-500 hover:shadow-md"
				>
					<CardHeader class="pb-2">
						<CardDescription>Pending Approvals</CardDescription>
						<CardTitle class="text-3xl text-yellow-600">{data.stats.pendingApprovals}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-xs text-muted-foreground">Awaiting review →</p>
					</CardContent>
				</Card>
			</a>

			<a href="/approvals?status=APPROVED" class="block">
				<Card
					class="cursor-pointer transition-all hover:border-green-500 hover:shadow-md"
				>
					<CardHeader class="pb-2">
						<CardDescription>Approved</CardDescription>
						<CardTitle class="text-3xl text-green-600">{data.stats.approvedApprovals}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-xs text-muted-foreground">This period →</p>
					</CardContent>
				</Card>
			</a>

			<a href="/approvals?status=REJECTED" class="block">
				<Card
					class="cursor-pointer transition-all hover:border-red-500 hover:shadow-md"
				>
					<CardHeader class="pb-2">
						<CardDescription>Rejected</CardDescription>
						<CardTitle class="text-3xl text-red-600">{data.stats.rejectedApprovals}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-xs text-muted-foreground">This period →</p>
					</CardContent>
				</Card>
			</a>
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<!-- Recent Approvals -->
			<Card class="lg:col-span-2">
				<CardHeader>
					<CardTitle>Recent Approvals</CardTitle>
					<CardDescription>Latest approval requests in the system</CardDescription>
				</CardHeader>
				<CardContent>
					{#if data.recentApprovals.length === 0}
						<p class="py-4 text-center text-gray-500">No approvals yet</p>
					{:else}
						<div class="space-y-3">
							{#each data.recentApprovals as approval (approval.id)}
								<div
									class="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
								>
									<div>
										<p class="font-medium">Approval #{approval.id}</p>
										<p class="text-sm text-gray-500">By {approval.creator_name}</p>
									</div>
									<div class="flex items-center gap-3">
										<Badge class={statusColors[approval.status]}>{approval.status}</Badge>
										{#if approval.status === 'PENDING'}
											<Button href="/approvals/{approval.id}" size="sm" variant="outline">
												Review
											</Button>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>

			<!-- Quick Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common tasks and navigation</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3">
					<Button href="/users" class="w-full justify-start" variant="outline">
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							></path>
						</svg>
						Manage Users
					</Button>

					<Button href="/users/create" class="w-full justify-start" variant="outline">
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							></path>
						</svg>
						Create User
					</Button>

					<Button href="/approvals" class="w-full justify-start" variant="outline">
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						View Approvals
					</Button>

					<Button href="/approvals/create" class="w-full justify-start" variant="outline">
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						New Approval
					</Button>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
