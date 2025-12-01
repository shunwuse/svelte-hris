<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	let { data, form } = $props();
</script>

<div class="container mx-auto max-w-2xl py-8">
	<h1 class="mb-8 text-3xl font-bold">Error Handling Test Page</h1>

	<!-- Load Error Test -->
	<Card class="mb-6">
		<CardHeader>
			<CardTitle>1. Load Function Error (safeLoad)</CardTitle>
			<CardDescription>This error is triggered when the page loads</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-2">
				<p><strong>Data:</strong> {data.testData}</p>
				{#if data.loadError}
					<p class="text-red-600"><strong>Error:</strong> {data.loadError}</p>
				{:else}
					<p class="text-green-600">No error</p>
				{/if}
			</div>
		</CardContent>
	</Card>

	<!-- Action Error Tests -->
	<Card class="mb-6">
		<CardHeader>
			<CardTitle>2. Action Errors (handleActionError)</CardTitle>
			<CardDescription>Click buttons to trigger different error types</CardDescription>
		</CardHeader>
		<CardContent>
			{#if form?.error}
				<div class="mb-4 rounded border border-red-300 bg-red-50 p-4">
					<p class="font-semibold text-red-600">Error: {form.error}</p>
					{#if form.code}
						<p class="text-sm text-gray-600">Code: {form.code}</p>
					{/if}
					{#if form.details}
						<div class="mt-2 text-sm text-gray-600">
							<p>Details:</p>
							<ul class="ml-4 list-disc">
								{#each Object.entries(form.details) as [key, value]}
									<li>{key}: {value}</li>
								{/each}
							</ul>
						</div>
					{/if}
					{#if form.testField}
						<p class="mt-2 text-sm text-gray-500">Preserved field: {form.testField}</p>
					{/if}
				</div>
			{/if}

			{#if form?.success}
				<div class="mb-4 rounded border border-green-300 bg-green-50 p-4">
					<p class="font-semibold text-green-600">{form.message}</p>
				</div>
			{/if}

			<div class="flex flex-wrap gap-4">
				<form method="POST" action="?/testNetworkError">
					<Button type="submit" variant="destructive">
						Test Network Error (500)
					</Button>
				</form>

				<form method="POST" action="?/testApiError">
					<Button type="submit" variant="outline" class="border-orange-500 text-orange-500">
						Test API Error (400)
					</Button>
				</form>

				<form method="POST" action="?/testSuccess">
					<Button type="submit" variant="default">
						Test Success
					</Button>
				</form>
			</div>
		</CardContent>
	</Card>

	<!-- Explanation -->
	<Card>
		<CardHeader>
			<CardTitle>How it works</CardTitle>
		</CardHeader>
		<CardContent class="prose prose-sm">
			<ul class="space-y-2 text-sm">
				<li>
					<strong>Network Error (500):</strong> Simulates when the API server is unreachable.
					Returns "Unable to connect to server".
				</li>
				<li>
					<strong>API Error (400):</strong> Simulates when the API returns a validation error.
					Returns the error message from ApiClientError.
				</li>
				<li>
					<strong>safeLoad:</strong> Wraps async operations and returns an object with data and error.
					On error, it returns the default value and error message.
				</li>
				<li>
					<strong>Form field preservation:</strong> When an error occurs, form fields are
					preserved so users don't lose their input.
				</li>
			</ul>
		</CardContent>
	</Card>

	<div class="mt-6">
		<a href="/" class="text-blue-600 hover:underline">← Back to Home</a>
	</div>
</div>
