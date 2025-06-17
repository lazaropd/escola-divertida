
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

<div class="container mx-auto py-16">
    {#if session}
    <div class="space-y-8">
        <section class="p-8 card">
            <h2 class="h2 text-primary-500">Bem-vindo à Escola Divertida!</h2>
            <img src="https://source.unsplash.com/800x400/?education,children" alt="Crianças aprendendo" class="rounded-lg mb-4" />
            <p class="text-lg">
                Explore um mundo de aprendizado interativo e divertido! Nossa plataforma oferece atividades educativas para crianças de 6 a 15 anos.
            </p>
        </section>

        <section class="p-8 card">
            <h2 class="h2 text-secondary-500">Sobre o Projeto</h2>
            <img src="https://source.unsplash.com/800x400/?learning,fun" alt="Aprendizado divertido" class="rounded-lg mb-4" />
            <p class="text-lg">
                A Escola Divertida é um projeto desenvolvido para tornar o aprendizado mais acessível e envolvente para crianças. Utilizamos tecnologias modernas e conteúdos criativos para estimular o interesse e a curiosidade dos alunos.
            </p>
        </section>

        <section class="p-8 card">
            <h2 class="h2 text-tertiary-500">Destaques Importantes e Uso Responsável</h2>
            <img src="https://source.unsplash.com/800x400/?disclaimer,warning" alt="Aviso" class="rounded-lg mb-4" />
            <p class="text-lg">
                Este é um projeto de desenvolvimento pessoal, sem fins lucrativos e sem qualquer vínculo com entidades governamentais, educacionais ou privadas.
            </p>
            <p class="text-lg">
                O objetivo principal é a exploração e o aprendizado através da aplicação prática de Inteligências Artificiais.
            </p>
            <p class="text-lg">
                O acompanhamento de um profissional capacitado da área da educação é indispensável para a formação de crianças. Este trabalho não substitui o papel da família, da sociedade e do Estado na educação.
            </p>
            <p class="text-lg">
                Todo o trabalho, ideias e insights gerados podem ser livremente compartilhados, desde que os créditos sejam mantidos ao criador original: Lazaro Pinheiro Domiciano.
            </p>
        </section>
    </div>
    {:else}
    <div class="flex justify-center items-center h-full">
        <Login />
    </div>
    {/if}
</div>
