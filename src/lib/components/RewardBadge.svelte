<script>
    export let points = 0;
    export let medal = "bronze"; // Pode ser bronze, prata, ouro
</script>

<div class="card p-4">
    <div class="flex items-center justify-center">
        <span class="text-xl font-bold mr-2">
            {points} Pontos
        </span>
        {#if medal === "bronze"}
            <svg class="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 5a1 1 0 112 0v2H9a1 1 0 110-2zm0 4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        {:else if medal === "prata"}
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 5a1 1 0 112 0v2H9a1 1 0 110-2zm0 4a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
        {:else}
            <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        {/if}
    </div>
</div>
