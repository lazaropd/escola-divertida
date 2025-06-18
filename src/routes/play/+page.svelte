<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import Exercise from '$lib/components/Exercise.svelte';
    import Mission from '$lib/components/Mission.svelte';
    import { selectedPlayer, missionCount } from '$lib/stores';
    import { getSubject } from '$lib/utils/missionUtils';

    let session;
    let user;
    let players = [];
    let localSelected = null;
    let exercise = null;
    let isLoadingExercise = false;
    let exerciseError: string | null = null;

    // Função para sortear um novo exercício (agora busca da API)
    async function getNewExercise() {
        if (!localSelected || !localSelected.disciplina) {
            console.warn('Jogador ou disciplina não selecionados para gerar exercício.');
            return;
        }

        isLoadingExercise = true;
        exerciseError = null;
        exercise = null; // Limpa o exercício anterior

        try {
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    disciplina: localSelected.disciplina,
                    unidade_tematica: "Mundo do trabalho", // Exemplo: você pode precisar obter isso de algum lugar
                    objeto_de_conhecimento: "Matéria-prima e indústria", // Exemplo: você pode precisar obter isso de algum lugar
                    codigo_objetivo_de_aprendizagem: "EF03GE05", // Exemplo: você pode precisar obter isso de algum lugar
                    objetivo_de_aprendizagem: "Identificar alimentos, minerais e outros produtos cultivados e extraídos da natureza, comparando as atividades de trabalho em diferentes lugares (campo e cidade), a fim de reconhecer a importância dessas atividades para a indústria.", // Exemplo
                    ano_ensino_fundamental: localSelected.ano_escolar
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar exercícios da API.');
            }

            const data = await response.json();
            if (data.exercises && data.exercises.length > 0) {
                // Seleciona um exercício aleatoriamente da lista retornada pela API
                exercise = data.exercises[Math.floor(Math.random() * data.exercises.length)];
            } else {
                exerciseError = 'Nenhum exercício foi gerado pela API.';
            }
        } catch (error) {
            console.error('Erro ao buscar novo exercício:', error);
            exerciseError = (error as Error).message || 'Erro desconhecido ao carregar exercício.';
        } finally {
            isLoadingExercise = false;
        }
    }


    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/');
        } else {
            user = session.user;
            await getPlayers();
        }
    });

    async function getPlayers() {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('ano_escolar', { ascending: true });

        if (error) {
            console.error('Erro ao buscar jogadores:', error);
            return;
        }

        players = data;
    }

    function handlePlayerChange() {
		if (localSelected) {
            localSelected = getSubject(localSelected);
			selectedPlayer.set(localSelected);
            getNewExercise(); // Sorteia o primeiro exercício ao selecionar o jogador
		}
	}


</script>

<div class="container mx-auto py-16">
    <h1 class="h3 text-primary-500">Nova Missão Espacial</h1>

    {#if session}

        <h2 class="h4 text-secondary-500 mb-4 pt-4">Astronauta:</h2>
        <select class="select" bind:value={localSelected} on:change={handlePlayerChange}>
            <option disabled selected value="">Selecione o comandante</option>
            {#each players as player}
                <option value={player}>{player.apelido} ({player.ano_escolar}º Ano)</option>
            {/each}
        </select>

		{#if localSelected && $selectedPlayer}
            <Mission />

            {#if $missionCount <= 10}
                {#if isLoadingExercise}
                    <p>Adicionando combustível no foguete...</p>
                {:else if exerciseError}
                    <p class="text-red-500">Erro: {exerciseError}</p>
                    <button class="btn variant-filled-primary mt-4" on:click={getNewExercise}>Tentar Novamente</button>
                {:else if exercise}
                    <!-- Ouve o evento 'nextExercise' do componente Exercise -->
                    <Exercise {exercise} on:nextExercise={getNewExercise} />
                {:else}
                {$selectedPlayer.disciplina} {localSelected.disciplina}
                {exercise} {localSelected.apelido} {$selectedPlayer.disciplina} {getNewExercise()}
                    <p>Selecione um astronauta para iniciar a missão.</p>
                {/if}
            {:else}
                <p>Todas as missões foram completadas! Parabéns!</p>
            {/if}
        {/if}

    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
