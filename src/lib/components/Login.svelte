<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { AppBar } from '@skeletonlabs/skeleton';

    let session;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;
    });
    
    let email = '';
    let password = '';
    let error = '';

    async function signIn() {
        const { data, error: err } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (err) {
            error = err.message;
        } else {
            $session = data.session;
            goto('/dashboard');
        }
    }
</script>

<div class="p-24">
<div class="card p-8 w-full max-w-md flex flex-col items-center">
    <h2 class="text-2xl mb-2">Entrar</h2>
    <p class="text-xs text-left mb-4">Para acessar a plataforma, você precisa de uma conta.<br />Para criar uma conta, envie um email para lazaro.domiciano@gmail.com</p><br />
    <div class="space-y-4 w-full">
        <input class="input p-4 w-full" type="email" placeholder="Email" bind:value={email} />
        <input class="input p-4 w-full" type="password" placeholder="Senha" bind:value={password} />
        <button class="btn variant-filled-primary w-full" on:click={signIn}>Entrar</button>
        {#if error}
            <div class="alert variant-filled-error">{error}</div>
        {/if}
    </div>
</div>
</div>
