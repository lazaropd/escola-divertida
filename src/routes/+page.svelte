
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
        <section class="p-8 card flex">
            <img src="/images/home1.png" alt="Crianças aprendendo" class="rounded-lg w-1/4 mr-4 object-contain" />
            <div>
                <h2 class="h4 text-primary-500 mb-4">Bem-vindo à Escola Divertida!</h2>
                <p class="text-sm">
                    Explore um mundo de aprendizado interativo e divertido! Nossa plataforma oferece atividades educativas para crianças de 6 a 15 anos.
                </p>
            </div>
        </section>

        <section class="p-8 card flex">
            <img src="/images/home2.png" alt="Aprendizado divertido" class="rounded-lg w-1/4 mr-4 object-contain" />
            <div>
                <h2 class="h4 text-secondary-500 mb-4">Sobre o Projeto</h2>
                <p class="text-sm">
                    A Escola Divertida é um projeto desenvolvido para tornar o aprendizado mais acessível e envolvente para crianças. Utilizamos tecnologias modernas e conteúdos criativos para estimular o interesse e a curiosidade dos alunos.
                </p>
            </div>
        </section>

        <section class="p-8 card flex">
            <img src="/images/home3.png" alt="Aviso" class="rounded-lg w-1/4 mr-4 object-contain" />
            <div>
                <h2 class="h4 text-tertiary-500 mb-4">Destaques Importantes e Uso Responsável</h2>
                <p class="text-sm">
                    Este é um projeto de desenvolvimento pessoal, sem fins lucrativos e sem qualquer vínculo com entidades governamentais, educacionais ou privadas.
                </p>
                <p class="text-sm">
                    O objetivo principal é a exploração e o aprendizado através da aplicação prática de Inteligências Artificiais no desenvolvimento de software.
                </p>
                <p class="text-sm">
                    O acompanhamento de um profissional capacitado da área da educação é indispensável para a formação de crianças. Este trabalho não substitui o papel da família, da sociedade e do Estado na educação.
                </p>
            </div>
        </section>
    </div>
    {:else}
        <div class="flex justify-center items-center h-full">
            <Login />
        </div>
    {/if}
</div>
