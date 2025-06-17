<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto } from '$app/navigation';

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
            goto('/dashboard');
        }
    }
</script>

<div class="card p-8 w-full max-w-xl">
    <div class="grid grid-cols-2 gap-8">
        <div class="flex flex-col justify-center items-center">
            <h2 class="text-2xl mb-2">Entrar</h2>
            <p class="text-xs text-center mb-4">Para acessar a plataforma, você precisa de uma conta.<br/>Para criar uma conta, envie um email para lazaro.domiciano@gmail.com</p>
        </div>
        <div class="border-l-2 border-surface-500">
            <div class="space-y-4 pl-8">
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
