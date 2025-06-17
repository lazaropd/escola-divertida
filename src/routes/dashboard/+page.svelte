<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let session;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/');
        }
    });
</script>

{#if session}
    <div class="container h-full mx-auto flex justify-center items-center">
        <div class="space-y-5">
            <h1 class="h1 text-primary-500">Bem-vindo ao Dashboard!</h1>
            <p class="text-lg">
                Aqui você pode encontrar diversas atividades educativas.
            </p>
        </div>
    </div>
{:else}
    <p>Redirecionando...</p>
{/if}
