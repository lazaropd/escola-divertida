<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let email = '';
    let password = '';
    let error = '';
    let session;

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;
    });

    async function signIn() {
        const { data, error: err } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (err) {
            error = err.message;
        } else {
            goto('/dashboard');
        }
    }
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-12">
        <h1 class="h1 text-primary-500 text-center">Bem-vindo à Escola Divertida!</h1>
        {#if session}
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
            <div class="card p-8 w-full max-w-md">
                <div class="grid grid-cols-1 gap-8">
                    <div class="flex flex-col justify-center items-center">
                        <h2 class="text-2xl mb-2">Entrar</h2>
                        <p class="text-sm text-center mb-4">Para acessar a plataforma, você precisa de uma conta.<br/>Para criar uma conta, envie um email para lazaro.domiciano@gmail.com</p>
                    </div>
                    <div>
                        <div class="space-y-4">
                            <input class="input p-4 w-full" type="email" placeholder="Email" bind:value={email} />
                            <input class="input p-4 w-full" type="password" placeholder="Senha" bind:value={password} />
                            <button class="btn variant-filled-primary w-full" on:click={signIn}>Entrar</button>
                            {#if error}
                                <div class="alert variant-filled-error">{error}</div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
	</div>
</div>
