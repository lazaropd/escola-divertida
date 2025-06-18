

<script lang="ts">
    import { onMount } from 'svelte';
    import { missionCount, missionComplete } from '$lib/stores';
    import { resetMission } from '$lib/utils/missionUtils';

	let containerEl: HTMLDivElement;
	const rocketSize = 48;

	function getRocketPosition(missionCount: number): number {
		if (!containerEl) return 0;
		const maxTravel = containerEl.clientWidth - rocketSize;
		return ((missionCount - 1) * 100 / 10) * maxTravel / 100;
	}
</script>

<div class="card p-8 mt-4 ">
    <div class="flex items-center justify-between relative" bind:this={containerEl}>
        <img src="/images/earth.png" alt="Terra" class="rounded-full" />
        <img
            src="/images/rocket.png"
            alt="Foguete"
            class="absolute rounded-full transition-transform duration-500"
            style="transform: rotate(90deg); top: 0%; left: {getRocketPosition($missionCount)}px;"
            />
		
        <img src="/images/alien.png" alt="Planeta Alienígena" class="rounded-full" style="right:0px"/>
    </div>
    <div class="flex items-center pt-4">
        {#if $missionCount < 11}
            <p class="text-sm">Contagem regressiva... {Math.max(11 - $missionCount, 0)}</p>
        {:else}
            <p class="text-md variant-filled-success">Missão concluída comandante!</p>
        {/if}
    </div>
    {#if $missionComplete}
        <div class="pt-4">
        <button class="btn variant-filled-success" on:click={resetMission}>Nova Aventura</button>
        </div>
    {/if}
</div>
