<script lang="ts">
    import { onMount } from 'svelte';

    let count = 1;
    let missionComplete = false;

    function advanceMission() {
        if (count < 11) {
            count++;
        }
        if (count === 11) {
            missionComplete = true;
        }
    }

    function resetMission() {
        count = 1;
        missionComplete = false;
    }
</script>

<div class="card p-4">
    <h3 class="h3">Missão Espacial</h3>
    {#if !missionComplete}
        <p>Contador: {count}/10</p>
        <img src="/images/rocket.png" alt="Foguete" style="width: 50px; transform: translateY(-{count * 10}px);" />
        <button class="btn variant-filled-primary" on:click={advanceMission}>Avançar</button>
    {:else}
        <p>Missão Completa!</p>
        <button class="btn variant-filled-success" on:click={resetMission}>Nova Aventura</button>
    {/if}
</div>
