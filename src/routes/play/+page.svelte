<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import Exercise from '$lib/components/Exercise.svelte';
    import Mission from '$lib/components/Mission.svelte';


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

<div class="container mx-auto py-16">
    <h1 class="h3 text-primary-500">Jogar</h1>

    {#if session}

		<Mission />
        <Exercise/>

    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
