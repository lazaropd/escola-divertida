
<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Login from '$lib/components/Login.svelte';

    let session;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;
    });
</script>

<div class="container h-full mx-auto flex justify-center items-center h-full">
    {#if session}
    <div class="p-24">
        <div class="card p-14">
            <h1 class="h2 text-primary-500 text-center">Você está na escola divertida</h1>
            <p>Aqui estão algumas atividades para você:</p>
            <ul>
                <li>Matemática: Resolva os problemas de adição</li>
                <li>Português: Leia o conto e responda as perguntas</li>
                <li>Ciências: Descubra os planetas do sistema solar</li>
            </ul>
        </div></div>
    {:else}
        <div class="p-24">
            <Login />
        </div>

    {/if}
</div>
