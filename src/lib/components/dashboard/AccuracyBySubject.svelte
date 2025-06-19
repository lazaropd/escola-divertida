<script lang="ts">
    import type { PlayerAccuracyBySubject } from '$lib/utils/dashboardUtils';

    export let data: PlayerAccuracyBySubject[]; // Recebe um array de PlayerAccuracyBySubject
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Taxa de Acertos por Disciplina</h4>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>Perguntas Respondidas</th>
                    <th>Acertos</th>
                    <th>Taxa de Acerto (%)</th>
                </tr>
            </thead>
            <tbody>
                {#each data as item}
                    <tr>
                        <td>{item.subject}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.correctQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhum dado de acertos por disciplina disponível para este astronauta.</p>
    {/if}
</div>
