<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1 text-primary-500">Bem-vindo à Escola Divertida!</h1>
		<p class="text-lg">
			Aprenda e divirta-se com atividades educativas para crianças de 6 a 15 anos.
		</p>

        <div class="card p-4 space-y-4">
            <h2 class="h2">Login</h2>
            <input class="input" type="email" placeholder="Email" bind:value={email} />
            <input class="input" type="password" placeholder="Senha" bind:value={password} />
            <button class="btn variant-filled-primary" on:click={signIn}>Entrar</button>
            {#if error}
                <div class="alert variant-filled-error">{error}</div>
            {/if}
        </div>
        <h1>Home</h1>
	</div>
</div>

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
