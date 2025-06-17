<script lang="ts">
	import '../app.css';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell>
	<!-- Header -->
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="uppercase">Escola Divertida</strong>
			</svelte:fragment>
		</AppBar>
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
