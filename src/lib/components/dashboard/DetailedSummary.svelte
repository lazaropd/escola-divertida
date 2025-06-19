<script lang="ts">
    import type { DetailedQuizSummary } from '$lib/utils/dashboardUtils';

    export let data: DetailedQuizSummary[];
</script>

<div class="card p-4 mb-4">
    <h4 class="h5 text-sm mb-2">Resumo Detalhado por Conteúdo</h4>
    {#if data.length > 0}
        <table class="table table-hover text-xs align-middle">
            <thead class="text-center text-xs">
                <tr>
                    <th class="p-1">Disciplina</th>
                    <th class="p-1">Unidade Temática</th>
                    <th class="p-1">Objeto de Conhecimento</th>
                    <th class="p-1">Código BNCC</th>
                    <th class="p-1">Perguntas</th>
                    <th class="p-1">Taxa (%)</th>
                </tr>
            </thead>
            <tbody class="text-xs">
                {#each data as item}
                    <tr class="align-middle">
                        <td class="p-1" style="font-size: 12px;">{item.subject}</td>
                        <td class="p-1" style="font-size: 10px;">{item.thematicUnit}</td>
                        <td class="p-1" style="font-size: 10px;">{item.knowledgeObject}</td>
                        <td class="text-center p-1" style="font-size: 12px;">{item.knowledgeCode}</td>
                        <td class="text-center p-1" style="font-size: 14px;">{item.totalQuestions}</td>
                        <td class="text-center p-1" style="font-size: 14px;">{item.accuracy.toFixed(1)}%</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>Nenhum resumo detalhado disponível para este astronauta.</p>
    {/if}
</div>
