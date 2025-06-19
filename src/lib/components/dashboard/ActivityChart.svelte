<script lang="ts">
    import type { PlayerActivity } from '$lib/utils/dashboardUtils';
    import { Bar } from 'svelte-chartjs';
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale
    } from 'chart.js';

    // Registra os componentes do Chart.js que serão usados
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

    export let data: PlayerActivity[];

    // Dados reativos para o Chart.js
    $: chartData = {
        labels: data.map(item => item.sessionDate),
        datasets: [
            {
                label: 'Perguntas Respondidas',
                data: data.map(item => item.totalQuestions),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Acertos',
                data: data.map(item => item.correctQuestions),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
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
                text: 'Atividade por Data',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Perguntas'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Data da Sessão'
                }
            }
        }
    };
</script>

<div class="card p-4 mb-4">
    <h4 class="h5">Atividade por Data</h4>
    {#if data.length > 0}
        <div style="height: 300px;"> <!-- Define uma altura para o gráfico -->
            <Bar data={chartData} options={chartOptions} />
        </div>
    {:else}
        <p>Nenhuma atividade registrada para este astronauta no período.</p>
    {/if}
</div>
