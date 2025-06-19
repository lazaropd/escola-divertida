<script lang="ts">
    import type { PlayerAccuracyBySubject } from '$lib/utils/dashboardUtils';

    export let data: PlayerAccuracyBySubject; // Recebe um único objeto de PlayerAccuracyBySubject
</script>

<div class="card p-4 mb-4">
    <h4 class="h5 text-sm mb-2">Taxa de Acertos Geral</h4>
    {#if data.totalQuestions > 0}
        <table class="table table-hover text-xs text-center align-middle">
            <thead>
                <tr>
                    <th class="text-center">Perguntas Respondidas</th>
                    <th class="text-center">Acertos</th>
                    <th class="text-center">Taxa de Acerto (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{data.totalQuestions}</td>
                    <td>{data.correctQuestions}</td>
                    <td>{data.accuracy.toFixed(1)}%</td>
                </tr>
            </tbody>
        </table>
    {:else}
        <p>Nenhum dado de acertos geral disponível para este astronauta.</p>
    {/if}
</div>
