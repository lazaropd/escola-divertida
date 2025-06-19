<script lang="ts">
    import type { DetailedQuizSummary } from '$lib/utils/dashboardUtils';

    export let data: DetailedQuizSummary[];
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Resumo Detalhado por Conteúdo</h4>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>Unidade Temática</th>
                    <th>Objeto de Conhecimento</th>
                    <th>Código BNCC</th>
                    <th>Perguntas Respondidas</th>
                    <th>Taxa de Acerto (%)</th>
                </tr>
            </thead>
            <tbody>
                {#each data as item}
                    <tr>
                        <td>{item.subject}</td>
                        <td>{item.thematicUnit}</td>
                        <td>{item.knowledgeObject}</td>
                        <td>{item.knowledgeCode}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhum resumo detalhado disponível para este astronauta.</p>
    {/if}
</div>
