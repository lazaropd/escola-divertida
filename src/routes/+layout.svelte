<script lang="ts">
	import '../app.css';
	import { AppShell } from '@skeletonlabs/skeleton';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<!-- App Shell -->
<AppShell class="h-screen flex flex-col">
	<!-- Header -->
	<svelte:fragment slot="header">
        <Header />
	</svelte:fragment>
	<!-- Page Content -->
	<svelte:fragment slot="page">
		<div class="flex-grow">
			<slot />
		</div>
	</svelte:fragment>
	<!-- Footer -->
	<svelte:fragment slot="footer">
        <Footer />
	</svelte:fragment>
</AppShell>
