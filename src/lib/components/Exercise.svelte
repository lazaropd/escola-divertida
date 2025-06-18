<script lang="ts">
    import { advanceMission } from '$lib/utils/missionUtils';
	import { LightSwitch } from '@skeletonlabs/skeleton';
    
	let quiz = {
		question: "Qual é a capital do Brasil?",
		options: [
			"Rio de Janeiro",
			"São Paulo",
			"Brasília",
			"Salvador",
			"Belo Horizonte",
			"Curitiba"
		],
		correctAnswer: "Brasília",
		explanation: "Brasília é a capital do Brasil desde 1960, quando substituiu o Rio de Janeiro.",
		disciplina: "Geografia"
	};

    let selectedAnswer = "";
    let result = "";
	let showExplanation = false;

    async function checkAnswer() {
        if (selectedAnswer === quiz.correctAnswer) {
            result = "Resposta correta!";
			advanceMission();
        } else {  
            result = "Resposta incorreta. Tente novamente.";
        }
    }

	function toggleExplanation() {
		showExplanation = !showExplanation;
	}
</script>

<div class="card p-4 mt-4">
    <h4 class="h4">{quiz.question}</h4>
	<div class="space-y-2">
		{#each quiz.options as option}
			<label class="flex items-center space-x-2">
				<input type="radio" class="radio" name="answer" value={option} bind:group={selectedAnswer} />
				<span>{option}</span>
				{#if option === quiz.correctAnswer && result === "Resposta correta!"}
					<span class="text-green-500">✓</span>
				{/if}
			</label>
		{/each}
	</div>
    <button class="btn variant-filled-primary mt-4" on:click={checkAnswer}>Verificar</button>
    {#if result}
        <p class="mt-2">{result}</p>
    {/if}
	<button class="btn variant-filled-secondary mt-2" on:click={toggleExplanation}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" class="mr-2"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
		Explicação
	</button>

	{#if showExplanation}
		<div class="alert variant-filled-info mt-4">
			{quiz.explanation}
		</div>
	{/if}
</div>
