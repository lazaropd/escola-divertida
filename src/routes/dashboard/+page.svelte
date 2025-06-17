<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Exercise from '$lib/components/Exercise.svelte';
    import RewardBadge from '$lib/components/RewardBadge.svelte';

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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Exercise />
            <RewardBadge points={100} medal="ouro" />
            <div>Atividade 3</div>
        </div>
    </div>
{:else}
    <p>Redirecionando...</p>
{/if}
