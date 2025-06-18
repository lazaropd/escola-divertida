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
            alert('Logout realizado com sucesso!');
            goto('/');
            window.location.reload();
        }
    }
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <strong class="uppercase">Escola Divertida</strong>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <a href="/" class="mr-4">Início</a>
        <a href="/api/generate-content" class="mr-4">Treinar</a>
        <a href="/dashboard" class="mr-4">Loja</a>
        {#if session}
            <button class="btn variant-filled-secondary" on:click={signOut}>
                Sair
            </button>
        {:else}
            <a href="/login" class="mr-4">Entrar</a>
        {/if}
    </svelte:fragment>
</AppBar>
