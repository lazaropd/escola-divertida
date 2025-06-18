<script lang="ts">
    import { advanceMission, recordQuizAttempt } from '$lib/utils/missionUtils'; // Importa recordQuizAttempt
    import { missionCount } from '$lib/stores';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let exercise: {
        question: string;
        options: string[];
        correctAnswerIndex: number;
        explanation: string;
    };

    // Novas props para registrar o quiz
    export let playerId: string;
    export let userId: string;
    export let subject: string;
    export let schoolYear: number;
    export let knowledgeCode: string;

    let selectedOptionIndex: number = -1;
    let isAnswerChecked: boolean = false;

    function selectOption(index: number) {
        if (!isAnswerChecked) { // Permite selecionar apenas se a resposta ainda não foi verificada
            selectedOptionIndex = index;
        }
    }

    async function checkAnswer() { // Tornar assíncrona para aguardar o registro
        advanceMission(); // A função advanceMission é chamada ao verificar
        isAnswerChecked = true;

        // Registrar a tentativa do quiz
        await recordQuizAttempt(
            playerId,
            userId,
            knowledgeCode,
            subject,
            schoolYear,
            exercise.question,
            exercise.options,
            exercise.correctAnswerIndex,
            selectedOptionIndex, // A resposta do usuário
            exercise.explanation
        );
    }

    function nextMission() {
        selectedOptionIndex = -1;
        isAnswerChecked = false;
        dispatch('nextExercise');
    }
</script>

<div class="exercise-container rounded-lg shadow-md pt-4">
    <h2 class="text-l font-semibold mb-4">{exercise.question}</h2>

    <div class="options-grid grid grid-cols-1 gap-3 mb-4">
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
            Verificar
        </button>

        {#if isAnswerChecked && $missionCount <= 10} <!-- Condição adicionada para mostrar o botão -->
            <button
                class="explanation-button px-5 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-200"
                on:click={nextMission}
            >
                Próxima Missão
            </button>
        {/if}
    </div>

    {#if isAnswerChecked}
        <div class="feedback mt-4 p-3 rounded-md
                {selectedOptionIndex === exercise.correctAnswerIndex ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
            <!-- Exibe a explicação diretamente após a verificação -->
            {exercise.explanation}
        </div>
    {/if}
</div>

<style>
    .option-button {
        border: 1px solid #b1b1b1; /* Borda cinza clara */
    }
    .option-button.bg-gray-600 {
        border-color: #333333; /* Borda cinza mais escura para selecionado */
    }
    .option-button.bg-green-200 {
        border-color: #a7f3d0; /* Borda verde para correto */
    }
    .option-button.bg-red-200 {
        border-color: #fecaca; /* Borda vermelha para incorreto */
    }
</style>
