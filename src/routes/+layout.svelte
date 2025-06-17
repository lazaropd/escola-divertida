<script lang="ts">
	import '../app.css';
	import { AppShell } from '@skeletonlabs/skeleton';
    import Header from '$lib/components/Header.svelte';
</script>

<!-- App Shell -->
<AppShell>
	<!-- Header -->
	<svelte:fragment slot="header">
        <Header />
	</svelte:fragment>
	<!-- Page Content -->
	<slot />
	<!-- Footer -->
	<svelte:fragment slot="footer">
		<div class="p-4 text-center">
			© {new Date().getFullYear()} Escola Divertida
		</div>
	</svelte:fragment>
</AppShell>
