

<script lang="ts">
    import { onMount } from 'svelte';
    import { missionCount, missionComplete } from '$lib/stores';
    import { advanceMission, resetMission } from '$lib/utils/missionUtils';
</script>

<div class="card p-8 mt-4 ">
    <div class="flex items-center justify-between relative">
        <img src="/images/earth.png" alt="Terra" class="rounded-full" />
        <img
            src="/images/rocket.png"
            alt="Foguete"
            class="absolute rounded-full transition-transform duration-500"
            style="transform: translateX({($missionCount - 1) * 10}%) rotate(90deg); top: 0%; left:0%;"
            />
		
        <img src="/images/alien.png" alt="Planeta Alienígena" class="rounded-full" style="right:0px"/>
    </div>
    {#if $missionComplete}
        <div class="pt-8">
        <button class="btn variant-filled-success" on:click={resetMission}>Nova Aventura</button>
        </div>
    {/if}
</div>
