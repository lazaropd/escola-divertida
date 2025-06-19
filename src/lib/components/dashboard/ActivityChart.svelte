<script lang="ts">
    import type { PlayerActivity } from '$lib/utils/dashboardUtils';

    export let data: PlayerActivity[];

    // Função para gerar um gráfico de barras simples com texto
    function generateBarChart(value: number, max: number, label: string): string {
        const barLength = 20; // Comprimento máximo da barra
        const filledLength = Math.round((value / max) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        return `${label.padEnd(10)} [${bar}] ${value}`;
    }
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Atividade por Data</h4>
    {#if data.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
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
                        <td>{item.sessionDate}</td>
                        <td>{item.totalQuestions}</td>
                        <td>{item.correctQuestions}</td>
                        <td>{item.accuracy.toFixed(1)}%</td>
                        <td>{item.avgDecisionTime.toFixed(1)}s</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <!-- Exemplo de visualização simples de "gráfico" de texto -->
        <h5 class="h6 mt-4">Visualização de Perguntas por Data:</h5>
        {#each data as item}
            <p class="font-mono text-sm">
                {generateBarChart(item.totalQuestions, Math.max(...data.map(d => d.totalQuestions)), item.sessionDate)}
            </p>
        {/each}
        <p class="text-sm text-gray-500 mt-2">
            *Para gráficos mais avançados, uma biblioteca de visualização de dados seria recomendada.
        </p>
    {:else}
        <p>Nenhuma atividade registrada para este astronauta no período.</p>
    {/if}
</div>
