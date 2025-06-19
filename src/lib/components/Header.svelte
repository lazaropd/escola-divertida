<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { AppBar } from '@skeletonlabs/skeleton';
    import { session } from '$lib/stores'; // Importa a store de sessão global

    // O componente agora assina a store 'session' diretamente.
    // Não é mais necessário um onMount local para buscar a sessão,
    // pois o layout já está gerenciando e atualizando a store.

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error);
        } else {
            // A store 'session' será automaticamente atualizada para null pelo listener no layout.
            // Não é mais necessário recarregar a página.
            goto('/');
        }
    }
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <!-- Alterado: Adicionado link para a página inicial -->
        <a href="/">
            <strong class="uppercase">Escola Divertida</strong>
        </a>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <a href="/" class="mx-2">Início</a>

        <!-- Usa $session para reagir às mudanças na store -->
        {#if $session}
        <div class="divider-vertical"></div>
		<a href="/play" class="mx-2">Jogar</a>
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
