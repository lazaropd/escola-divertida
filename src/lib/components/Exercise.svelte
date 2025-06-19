<script lang="ts">
    import { advanceMission, recordQuizAttempt } from '$lib/utils/missionUtils';
    import { missionCount } from '$lib/stores';
    import { createEventDispatcher, onMount } from 'svelte'; // Importa onMount

    const dispatch = createEventDispatcher();

    export let exercise: {
        question: string;
        options: string[];
        correctAnswerIndex: number;
        explanation: string;
    };

    export let playerId: string;
    export let userId: string;
    export let subject: string;
    export let schoolYear: number;
    export let knowledgeCode: string;

    let selectedOptionIndex: number = -1;
    let isAnswerChecked: boolean = false;
    let startTime: number; // Variável para armazenar o timestamp de início

    // Inicia o timer quando o componente é montado
    onMount(() => {
        startTime = Date.now();
    });

    // Reinicia o timer sempre que um novo exercício é carregado (a prop 'exercise' muda)
    $: if (exercise) {
        startTime = Date.now();
        selectedOptionIndex = -1; // Garante que a seleção anterior seja limpa
        isAnswerChecked = false; // Garante que o estado de verificação seja resetado
    }

    function selectOption(index: number) {
        if (!isAnswerChecked) {
            selectedOptionIndex = index;
        }
    }

    async function checkAnswer() {
        const endTime = Date.now();
        const decisionTime = endTime - startTime; // Calcula o tempo de decisão em milissegundos

        advanceMission();
        isAnswerChecked = true;

        await recordQuizAttempt(
            playerId,
            userId,
            knowledgeCode,
            subject,
            schoolYear,
            exercise.question,
            exercise.options,
            exercise.correctAnswerIndex,
            selectedOptionIndex,
            exercise.explanation,
            decisionTime // Passa o tempo de decisão
        );
    }

    function nextMission() {
        // O reset do estado (selectedOptionIndex, isAnswerChecked) é feito na reatividade do 'exercise'
        // quando o componente pai despacha 'nextExercise' e fornece um novo 'exercise' prop.
        dispatch('nextExercise');
    }
</script>

<div class="exercise-container rounded-lg shadow-md pt-4">
    <h2 class="text-l font-semibold mb-2">{exercise.question}</h2>

    <div class="options-grid grid grid-cols-1 gap-2 mb-2">
        {#each exercise.options as option, index}
            <button
                class="option-button p-2 text-sm rounded-md text-left transition-colors duration-200
                       {selectedOptionIndex === index && !isAnswerChecked ? 'bg-gray-600' : ''}
                       {isAnswerChecked && index === exercise.correctAnswerIndex ? 'bg-green-200 text-green-800' : ''}
                       {isAnswerChecked && selectedOptionIndex === index && selectedOptionIndex !== exercise.correctAnswerIndex ? 'bg-red-200 text-red-800' : ''}
                       {!isAnswerChecked ? 'hover:bg-gray-600 cursor-pointer' : 'cursor-not-allowed'}"
                on:click={() => selectOption(index)}
                disabled={isAnswerChecked}
            >
                {option}
            </button>
        {/each}
    </div>

    <div class="actions flex justify-between items-center">
        <button
            class="check-button px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200
                   {selectedOptionIndex === -1 || isAnswerChecked ? 'opacity-50 cursor-not-allowed' : ''}"
            on:click={checkAnswer}
            disabled={selectedOptionIndex === -1 || isAnswerChecked}
        >
            Conferir
        </button>

        {#if isAnswerChecked && $missionCount <= 10}
            <button
                class="explanation-button px-5 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200"
                on:click={nextMission}
            >
                Próxima Missão
            </button>
        {/if}
    </div>

    {#if isAnswerChecked}
        <div class="feedback mt-4 p-2 rounded-md text-sm
                {selectedOptionIndex === exercise.correctAnswerIndex ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
            {exercise.explanation}
        </div>
    {/if}
</div>

<style>
    .option-button {
        border: 1px solid #b1b1b1;
    }
    .option-button.bg-gray-600 {
        border-color: #333333;
    }
    .option-button.bg-green-200 {
        border-color: #a7f3d0;
    }
    .option-button.bg-red-200 {
        border-color: #fecaca;
    }
</style>
