<script lang="ts">
    import type { PlayerAccuracyBySubject } from '$lib/utils/dashboardUtils';
    import { Chart } from 'svelte-chartjs'; // Importa o componente Chart genérico
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        BarElement,
        LineElement, // Necessário para o gráfico de linha
        CategoryScale,
        LinearScale,
        PointElement // Necessário para os pontos na linha
    } from 'chart.js';

    // Registra os componentes do Chart.js que serão usados
    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement
    );

    export let data: PlayerAccuracyBySubject[]; // Recebe um array de PlayerAccuracyBySubject

    // Dados reativos para o Chart.js
    $: chartData = {
        labels: data.map(item => item.subject),
        datasets: [
            {
                type: 'bar' as const, // Tipo de gráfico de barras
                label: 'Perguntas Respondidas',
                data: data.map(item => item.totalQuestions),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y' // Associa ao eixo Y principal
            },
            {
                type: 'line' as const, // Tipo de gráfico de linha
                label: 'Taxa de Acerto (%)',
                data: data.map(item => item.accuracy), // CORRIGIDO: Removido .toFixed(1)
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
                yAxisID: 'y1' // Associa ao eixo Y secundário
            }
        ]
    };

    // Opções do gráfico
    $: chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false, // O título já está no h4 do card
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.yAxisID === 'y1') { // Se for o eixo da taxa de acerto
                                label += context.parsed.y.toFixed(1) + '%';
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: { // Eixo Y para as barras (Perguntas Respondidas)
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Perguntas'
                }
            },
            y1: { // Eixo Y secundário para a linha (Taxa de Acerto)
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                beginAtZero: true,
                max: 100, // Taxa de acerto vai de 0 a 100%
                title: {
                    display: true,
                    text: 'Taxa de Acerto (%)'
                },
                grid: {
                    drawOnChartArea: false, // Não desenha linhas de grade para este eixo
                },
                ticks: {
                    callback: function(value) {
                        return value + '%'; // Adiciona o símbolo de porcentagem aos rótulos do eixo
                    }
                }
            }
        }
    };
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Taxa de Acertos por Disciplina</h4>
    {#if data.length > 0}
        <div style="height: 350px;"> <!-- Define uma altura para o gráfico -->
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    {:else}
        <p>Nenhum dado de acertos por disciplina disponível para este astronauta.</p>
    {/if}
</div>
