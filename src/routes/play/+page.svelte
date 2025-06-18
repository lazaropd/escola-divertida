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

	const exercises = [
		{
			question: "Qual é a capital do Brasil?",
			options: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador", "Campinas"],
			correctAnswerIndex: 1,
			explanation: "Brasília é a capital do Brasil desde 1960."
		},
		{
			question: "Quanto é 7 x 8?",
			options: ["56", "48", "64", "58", "49"],
			correctAnswerIndex: 0,
			explanation: "7 vezes 8 é igual a 56."
		},
		{
			question: "Quem escreveu 'Dom Casmurro'?",
			options: ["Machado de Assis", "José de Alencar", "Clarice Lispector", "Monteiro Lobato", "Graciliano Ramos"],
			correctAnswerIndex: 0,
			explanation: "Machado de Assis é o autor de Dom Casmurro."
		},
		{
			question: "Qual é o maior planeta do sistema solar?",
			options: ["Terra", "Júpiter", "Marte", "Saturno", "Netuno"],
			correctAnswerIndex: 1,
			explanation: "Júpiter é o maior planeta do sistema solar."
		},
		{
			question: "Em que continente está o Egito?",
			options: ["África", "Ásia", "Europa", "América do Sul", "Oceania"],
			correctAnswerIndex: 0,
			explanation: "O Egito está localizado no norte da África."
		}
	];

    // Função para sortear um novo exercício
    function getNewExercise() {
        exercise = exercises[Math.floor(Math.random() * exercises.length)];
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
			selectedPlayer.set(getSubject(localSelected));
            getNewExercise(); // Sorteia o primeiro exercício ao selecionar o jogador
		}
	}


</script>

<div class="container mx-auto py-16">
    <h1 class="h3 text-primary-500">Nova Missão Espacial</h1>

    {#if session}

        <h2 class="h4 text-secondary-500 mb-4 pt-4">Astronauta:</h2>
        <select class="select" bind:value={localSelected} on:change={handlePlayerChange}>
            <option disabled selected value="">Selecione um jogador</option>
            {#each players as player}
                <option value={player}>{player.apelido} ({player.ano_escolar}º Ano)</option>
            {/each}
        </select>

		{#if localSelected && $selectedPlayer && exercise}
            <Mission />

            {#if $missionCount <= 10}
                <!-- Ouve o evento 'nextExercise' do componente Exercise -->
                <Exercise {exercise} on:nextExercise={getNewExercise} />
            {/if}
        {/if}

    {:else}
        <p>Redirecionando...</p> 
    {/if}
</div>
