<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	async function signInWithGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
		if (error) {
			console.error("Erro ao fazer login com o Google:", error);
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1 text-primary-500">Bem-vindo à Escola Divertida!</h1>
		<p class="text-lg">
			Aprenda e divirta-se com atividades educativas para crianças de 6 a 15 anos.
		</p>
		<button class="btn variant-filled-primary" on:click={signInWithGoogle}>
			Entrar com Google
		</button>
        <h1>Home</h1>
	</div>
</div>
