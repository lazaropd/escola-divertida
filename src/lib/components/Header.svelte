<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { AppBar } from '@skeletonlabs/skeleton';

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
    {#if session}
        <button class="btn variant-filled-secondary" on:click={signOut}>
            Sair
        </button>
    {/if}
</AppBar>
