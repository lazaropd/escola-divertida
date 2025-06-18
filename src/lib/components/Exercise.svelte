<script lang="ts">
    import { missionCount, missionComplete } from '$lib/stores';

    let question = "Qual é a capital do Brasil?";
    let answer = "";
    let result = "";

    async function checkAnswer() {
        // Aqui você pode adicionar a lógica para verificar a resposta
        if (answer.toLowerCase() === "brasília") {
            result = "Resposta correta!";
			advanceMission();
        } else {  
            result = "Resposta incorreta. Tente novamente.";
        }
    }

	function advanceMission() {
        if ($missionCount < 11) {
            $missionCount++;
        }
        if ($missionCount === 11) {
            $missionComplete = true;
        }
    }
</script>

<div class="card p-4">
    <h4 class="h4">{question}</h4>
    <input type="text" class="input" placeholder="Sua resposta" bind:value={answer} />
    <button class="btn variant-filled-primary mt-2" on:click={checkAnswer}>Verificar</button>
    {#if result}
        <p class="mt-2">{result}</p>
    {/if}
</div>
