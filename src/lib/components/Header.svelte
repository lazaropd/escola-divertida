<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { AppBar, NavLink } from '@skeletonlabs/skeleton';

    let session;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;
    });

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error);
        } else {
            goto('/');
        }
    }
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <strong class="uppercase">Escola Divertida</strong>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <NavLink href="/" class="mr-4">Home</NavLink>
        <NavLink href="/dashboard" class="mr-4">Dashboard</NavLink>
        <NavLink href="/api/generate-content" class="mr-4">Gerar Conteúdo</NavLink>
        {#if session}
            <button class="btn variant-filled-secondary" on:click={signOut}>
                Sair
            </button>
        {/if}
    </svelte:fragment>
</AppBar>
