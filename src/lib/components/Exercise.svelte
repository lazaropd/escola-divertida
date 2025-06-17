<script lang="ts">
    let question = "Qual é a capital do Brasil?";
    let answer = "";
    let result = "";

    async function checkAnswer() {
        // Aqui você pode adicionar a lógica para verificar a resposta
        if (answer.toLowerCase() === "brasília") {
            result = "Resposta correta!";
        } else {
            result = "Resposta incorreta. Tente novamente.";
        }
    }
</script>

<div class="card p-4">
    <h2 class="h2">{question}</h2>
    <input type="text" class="input" placeholder="Sua resposta" bind:value={answer} />
    <button class="btn variant-filled-primary mt-2" on:click={checkAnswer}>Verificar</button>
    {#if result}
        <p class="mt-2">{result}</p>
    {/if}
</div>
