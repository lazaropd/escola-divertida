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
            window.location.reload();
        }
    }
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <strong class="uppercase">Escola Divertida</strong>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <a href="/" class="mx-2">Início</a>
        
        {#if session}
        <div class="divider-vertical"></div>
        <a href="/api/generate-content" class="mx-2">TBD</a>
        <div class="divider-vertical"></div>
        <a href="/dashboard" class="mx-2">Pontos</a>
        <div class="divider-vertical"></div>
        <a href="/profile" class="mx-2">Perfil</a>
        <div class="divider-vertical"></div>
            <button class="btn variant-filled-secondary mx-2" on:click={signOut}>
                Sair
            </button>
        {:else}
            <a href="/login" class="btn variant-filled-secondary mx-2">Entrar</a>
        {/if}
    </svelte:fragment>
</AppBar>
