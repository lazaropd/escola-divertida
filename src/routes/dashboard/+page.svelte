<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let session;
    let user;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/');
        } else {
            user = session.user;
        }
    });
</script>

{#if session}
    <div class="container mx-auto p-4">
        <h1 class="h1 text-primary-500">Bem-vindo, {user?.user_metadata?.full_name}!</h1>
        <p class="text-lg">Aqui você pode encontrar diversas atividades educativas.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <!-- Aqui você pode adicionar os componentes de exercício -->
            <div>Atividade 1</div>
            <div>Atividade 2</div>
            <div>Atividade 3</div>
        </div>
    </div>
{:else}
    <p>Redirecionando...</p>
{/if}
