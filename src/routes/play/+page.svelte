<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import Exercise from '$lib/components/Exercise.svelte';

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

<div class="container mx-auto p-4">
    <h1 class="h1 text-primary-500">Jogar</h1>

    {#if session}
        <div>
            <h2 class="h2">Exercício</h2>
			<Exercise/>
        </div>
    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
