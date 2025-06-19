<script lang="ts">
    import type { DetailedQuizSummary } from '$lib/utils/dashboardUtils';

    export let data: DetailedQuizSummary[];
</script>

<div class="card p-4 mb-4">
    <h3 class="h4">Resumo Detalhado por Conteúdo</h3>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Astronauta</th>
                    <th>Disciplina</th>
                    <th>Unidade Temática</th>
                    <th>Objeto de Conhecimento</th>
                    <th>Código BNCC</th>
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
                        <td>{item.thematicUnit}</td>
                        <td>{item.knowledgeObject}</td>
                        <td>{item.knowledgeCode}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.correctQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhum resumo detalhado disponível.</p>
    {/if}
</div>
