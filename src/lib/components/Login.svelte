<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { goto, invalidateAll } from '$app/navigation';
    import { session } from '$lib/stores'; // Importa a store de sessão global

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
            // ATENÇÃO: Atualiza a store global 'session'
            session.set(data.session); 
            await goto('/dashboard');
            await invalidateAll(); // Invalida todos os dados carregados para garantir que o dashboard seja atualizado
        }
    }
</script>

<div class="p-24">
<div class="card p-8 w-full max-w-md flex flex-col items-center">
    <h2 class="text-2xl mb-2">Entrar</h2>
    <p class="text-sm text-left mb-4">Para acessar a plataforma, você precisa de uma conta.<br />Entre em contato para criar uma conta.</p><br />
    <div class="space-y-4 w-full">
        <input class="input p-4 w-full" type="email" placeholder="Email" bind:value={email} />
        <input class="input p-4 w-full" type="password" placeholder="Senha" bind:value={password} />
        <button class="btn variant-filled-primary w-full" on:click={signIn}>Entrar</button>
        {#if error}
            <div class="alert variant-filled-error">{error}</div>
        {/if}

    </div>

        <!-- Novo Card de Demonstração -->
        <div class="card variant-filled-surface p-4 mt-8">
            <p class="text-sm font-semibold">Apenas conhecendo o projeto?</p>
            <p class="text-xs mt-1 pt-4">Entre como visitante para uma experiência completa e sem compromisso!</p>
            <p class="text-sm font-bold mt-1 pt-4">Usuário: visitante@visitante.br</p>
            <p class="text-sm font-bold">Senha: 123teste</p>
        </div>

</div>
</div>
