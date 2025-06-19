<script lang="ts">
    import type { PlayerAccuracyBySubject } from '$lib/utils/dashboardUtils';

    export let data: PlayerAccuracyBySubject[];
</script>

<div class="card p-4 mb-4">
    <h3 class="h4">Taxa de Acertos por Astronauta e Disciplina</h3>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Astronauta</th>
                    <th>Disciplina</th>
                    <th>Perguntas Respondidas</th>
                    <th>Acertos</th>
                    <th>Taxa de Acerto (%)</th>
                </tr>
            </thead>
            <tbody>
                {#each data as item}
                    <tr>
                        <td>{item.apelido}</td>
                        <td>{item.subject}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.correctQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhum dado de acertos por disciplina disponível.</p>
    {/if}
</div>
