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
    <div class="flex items-center justify-between">
        <img src="/images/earth.png" alt="Terra" class="rounded-full w-12 h-12" />
        <div class="flex flex-col items-center">
            <p>Contador: {count}/10</p>
            <img src="/images/rocket.png" alt="Foguete" class="rounded-full w-12 h-12" style="transform: translateY(-{count * 10}px);" />
            <button class="btn variant-filled-primary" on:click={advanceMission}>Avançar</button>
        </div>
        <img src="/images/alien.png" alt="Planeta Alienígena" class="rounded-full w-12 h-12" />
    </div>
    {#if missionComplete}
        <p>Missão Completa!</p>
        <button class="btn variant-filled-success" on:click={resetMission}>Nova Aventura</button>
    {/if}
</div>
