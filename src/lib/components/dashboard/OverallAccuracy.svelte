<script lang="ts">
    import type { PlayerAccuracyBySubject } from '$lib/utils/dashboardUtils';

    export let data: PlayerAccuracyBySubject; // Recebe um único objeto de PlayerAccuracyBySubject
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Taxa de Acertos Geral</h4>
    {#if data.totalQuestions > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Perguntas Respondidas</th>
                    <th>Acertos</th>
                    <th>Taxa de Acerto (%)</th>
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
