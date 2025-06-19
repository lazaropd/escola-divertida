<script lang="ts">
	import '../app.css';
	import { AppShell } from '@skeletonlabs/skeleton';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { supabase } from '$lib/supabaseClient'; // Importa o cliente Supabase
    import { session } from '$lib/stores'; // Importa a store de sessão

    // No onMount do layout, configuramos o listener de autenticação do Supabase
    onMount(() => {
        // Escuta por mudanças no estado de autenticação
        const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
            // Atualiza a store 'session' com a nova sessão
            session.set(currentSession);
        });

        // Busca a sessão inicial quando o layout é montado
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            session.set(currentSession);
        });

        // Retorna uma função de cleanup para remover o listener quando o componente for destruído
        return () => {
            authListener.unsubscribe();
        };
    });
</script>

<!-- App Shell -->
<AppShell class="h-screen flex flex-col">
	<!-- Header -->
	<svelte:fragment slot="header">
        <Header />
	</svelte:fragment>
	<!-- Page Content -->
	<div class="flex-grow flex flex-col">
		<slot />
	</div>
	<!-- Footer -->
	<svelte:fragment slot="footer">
        <Footer />
	</svelte:fragment>
</AppShell>
