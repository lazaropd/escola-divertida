<script lang="ts">
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';

    let session;
    let user;
    let prompt = "";
    let content = "";
    let error = "";

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/');
        } else {
            user = session.user;
        }
    });

    async function generateContent() {
        try {
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            content = data.content;
            error = "";
        } catch (e) {
            error = e.message;
            content = "";
        }
    }
</script>

{#if session}
    <div class="container mx-auto p-4">
        <h1 class="h1 text-primary-500">Gerar Conteúdo</h1>
        <p class="text-lg">Digite um prompt para gerar conteúdo.</p>

        <div class="space-y-4">
            <input type="text" class="input" placeholder="Digite o prompt" bind:value={prompt} />
            <button class="btn variant-filled-primary" on:click={generateContent}>Gerar</button>
        </div>

        {#if content}
            <div class="card p-4 mt-4">
                <h2 class="h2">Conteúdo Gerado:</h2>
                <p>{content}</p>
            </div>
        {/if}

        {#if error}
            <div class="alert variant-filled-error mt-4">
                <p>Erro: {error}</p>
            </div>
        {/if}
    </div>
{:else}
    <p>Redirecionando...</p>
{/if}
