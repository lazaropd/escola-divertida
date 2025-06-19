<script lang="ts">
    import type { PlayerActivity } from '$lib/utils/dashboardUtils';

    export let data: PlayerActivity[];
</script>

<div class="card p-4 mb-4">
    <h3 class="h4">Atividade por Criança e Data</h3>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Astronauta</th>
                    <th>Data da Sessão</th>
                    <th>Perguntas Respondidas</th>
                    <th>Acertos</th>
                    <th>Taxa de Acerto (%)</th>
                    <th>Tempo Médio (s)</th>
                </tr>
            </thead>
            <tbody>
                {#each data as item}
                    <tr>
                        <td>{item.apelido}</td>
                        <td>{item.sessionDate}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.correctQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                        <td>{item.avgDecisionTime.toFixed(1)}s</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhuma atividade registrada ainda.</p>
    {/if}
</div>
