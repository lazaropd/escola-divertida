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
    let exercise = null; // O exercício atual a ser exibido no componente Exercise
    let exercises: any[] = []; // Array para armazenar os 10 exercícios do Gemini
    let currentExerciseIndex: number = -1; // Índice do exercício atual no array 'exercises'

    let isLoadingExercise = false;
    let exerciseError: string | null = null;

    // Variáveis para armazenar e exibir as informações da BNCC
    let currentUnidadeTematica: string = "";
    let currentObjetoConhecimento: string = "";
    let currentCodigoObjetivo: string = "";
    let currentObjetivoAprendizagem: string = ""; // Adicionado para consistência, embora não seja exibido no final

    // Função para buscar um novo lote de 10 exercícios da API do Gemini
    async function loadNewQuizBatch() {
        if (!localSelected || !$selectedPlayer.disciplina) {
            console.warn('Jogador ou disciplina não selecionados para gerar exercício.');
            return;
        }

        isLoadingExercise = true;
        exerciseError = null;
        exercise = null; // Limpa o exercício atual enquanto carrega

        // Define as informações da BNCC que serão usadas no prompt e exibidas
        currentUnidadeTematica = "Mundo do trabalho"; // Exemplo: você pode precisar obter isso de algum lugar
        currentObjetoConhecimento = "Matéria-prima e indústria"; // Exemplo: você pode precisar obter isso de algum lugar
        currentCodigoObjetivo = "EF03GE05"; // Exemplo: você pode precisar obter isso de algum lugar
        currentObjetivoAprendizagem = "Identificar alimentos, minerais e outros produtos cultivados e extraídos da natureza, comparando as atividades de trabalho em diferentes lugares (campo e cidade), a fim de reconhecer a importância dessas atividades para a indústria."; // Exemplo

        try {
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    disciplina: $selectedPlayer.disciplina,
                    unidade_tematica: currentUnidadeTematica,
                    objeto_de_conhecimento: currentObjetoConhecimento,
                    codigo_objetivo_de_aprendizagem: currentCodigoObjetivo,
                    objetivo_de_aprendizagem: currentObjetivoAprendizagem,
                    ano_ensino_fundamental: localSelected.ano_escolar
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar exercícios da API.');
            }

            const data = await response.json();
            if (data.exercises && data.exercises.length > 0) {
                exercises = data.exercises; // Armazena todos os 10 exercícios
                currentExerciseIndex = 0; // Começa com o primeiro
                exercise = exercises[currentExerciseIndex]; // Define o primeiro exercício para exibição
            } else {
                exerciseError = 'Nenhum exercício foi gerado pela API.';
            }
        } catch (error) {
            console.error('Erro ao buscar novo lote de exercícios:', error);
            exerciseError = (error as Error).message || 'Erro desconhecido ao carregar exercícios.';
        } finally {
            isLoadingExercise = false;
        }
    }

    // Função para exibir o próximo exercício do lote pré-carregado
    function showNextExercise() {
        currentExerciseIndex++;
        if (currentExerciseIndex < exercises.length) {
            exercise = exercises[currentExerciseIndex]; // Exibe o próximo exercício do lote
        } else {
            // Todos os 10 exercícios do lote atual foram utilizados.
            // Verifica se ainda há missões a serem completadas para buscar um novo lote.
            if ($missionCount < 10) { // Assumindo 10 é o número máximo de missões
                loadNewQuizBatch(); // Busca um novo lote de exercícios
            } else {
                // Todas as missões foram completadas, não há mais exercícios para carregar.
                exercise = null; // Limpa o exercício para exibir a mensagem de conclusão
            }
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
            // localSelected já é o objeto do jogador selecionado no dropdown.
            // Apenas atualizamos a store selectedPlayer com as informações de disciplina.
			selectedPlayer.set(getSubject(localSelected));
            loadNewQuizBatch(); // Inicia o carregamento do primeiro lote de exercícios
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
                    <p class="h4 text-tertiary-500 mb-4 pt-4">Adicionando combustível no foguete, aguarde...</p>
                {:else if exerciseError}
                    <p class="text-red-500">Erro: {exerciseError}</p>
                    <button class="btn variant-filled-primary mt-4" on:click={loadNewQuizBatch}>Tentar Novamente</button>
                {:else if exercise}
                    <!-- Ouve o evento 'nextExercise' do componente Exercise -->
                    <Exercise {exercise} on:nextExercise={showNextExercise} />
                {:else}
                    <!-- Estado inicial ou após todas as missões completadas -->
                    <p>Selecione um astronauta para iniciar a missão.</p>
                {/if}
                
            {/if}
        {/if}

    {:else}
        <p>Redirecionando...</p>
    {/if}

    {#if $selectedPlayer && currentCodigoObjetivo}
        <p class="text-xs text-gray-500 mt-8 text-center">
            <b>({currentCodigoObjetivo})</b> {currentUnidadeTematica} - {currentObjetoConhecimento} ({$selectedPlayer.disciplina || ''})
        </p>
    {/if}
</div>
