
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
        <h1 class="h1 text-primary-500 text-center">Bem-vindo à Escola Divertida!</h1>
        <div class="card p-4">
            <h2 class="h2">Bem-vindo à Home!</h2>
            <p>Aqui estão algumas atividades para você:</p>
            <ul>
                <li>Matemática: Resolva os problemas de adição</li>
                <li>Português: Leia o conto e responda as perguntas</li>
                <li>Ciências: Descubra os planetas do sistema solar</li>
            </ul>
        </div>
    {:else}
        <div class="flex justify-center items-center h-full">
            <Login />
        </div>
    {/if}
</div>
