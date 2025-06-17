<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Exercise from '$lib/components/Exercise.svelte';
    import RewardBadge from '$lib/components/RewardBadge.svelte';

    let session;
    let user;
    let redirecting = false;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            redirecting = true;
            setTimeout(() => {
                goto('/');
            }, 2000); // Redireciona após 2 segundos
        } else {
            user = session.user;
        }
    });
</script>

<div>
{#if session}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Exercise />
            <RewardBadge points={100} medal="ouro" />
            <div>Atividade 3</div>
        </div>
{:else}
    {#if redirecting}
        <p>Redirecionando para a página inicial porque você não está logado...</p>
    {:else}
        <p>Redirecionando...</p>
    {/if}
{/if}
<h1>Dashboard</h1>
</div>
