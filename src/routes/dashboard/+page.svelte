<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {
        filterRecordsByDate,
        processActivitySummary,
        processOverallAccuracy,
        processAccuracyBySubject,
        processDetailedSummary,
        type QuizRecord
    } from '$lib/utils/dashboardUtils';

    import ActivityChart from '$lib/components/dashboard/ActivityChart.svelte';
    import OverallAccuracy from '$lib/components/dashboard/OverallAccuracy.svelte';
    import AccuracyBySubject from '$lib/components/dashboard/AccuracyBySubject.svelte';
    import DetailedSummary from '$lib/components/dashboard/DetailedSummary.svelte';

    let session;
    let user;
    let isLoading = true;
    let error: string | null = null;
    let allQuizRecords: QuizRecord[] = []; // Todos os registros brutos
    let filteredQuizRecords: QuizRecord[] = []; // Registros filtrados por data

    let startDate: string = '';
    let endDate: string = '';

    // Agrupamento de dados por astronauta
    let playersData: Map<string, QuizRecord[]> = new Map();

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/login');
            return;
        } else {
            user = session.user;
            // Define as datas padrão para os últimos 30 dias
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);

            startDate = thirtyDaysAgo.toISOString().split('T')[0];
            endDate = today.toISOString().split('T')[0];

            await fetchQuizSummary();
        }
    });

    async function fetchQuizSummary() {
        isLoading = true;
        error = null;
        try {
            const { data, error: dbError } = await supabase
                .from('quiz_summary')
                .select('*')
                .eq('user_id', user.id)
                .order('session_date', { ascending: true }); // Ordena para facilitar o processamento

            if (dbError) {
                console.error('Erro ao buscar resumo do quiz:', dbError);
                throw new Error('Falha ao carregar dados do dashboard.');
            }

            allQuizRecords = data || [];
            applyFiltersAndProcessData();
        } catch (e) {
            error = (e as Error).message;
        } finally {
            isLoading = false;
        }
    }

    function applyFiltersAndProcessData() {
        filteredQuizRecords = filterRecordsByDate(allQuizRecords, startDate, endDate);
        groupDataByPlayer(filteredQuizRecords);
    }

    function groupDataByPlayer(records: QuizRecord[]) {
        playersData.clear(); // Limpa dados anteriores
        records.forEach(record => {
            if (!playersData.has(record.player_id)) {
                playersData.set(record.player_id, []);
            }
            playersData.get(record.player_id)?.push(record);
        });
    }

    // Re-aplica os filtros e processa os dados quando as datas mudam
    $: startDate, endDate, applyFiltersAndProcessData();
</script>

<div class="container mx-auto py-16">
    <h1 class="h3 text-primary-500">Dashboard de Progresso</h1>

    {#if session}
        <div class="card p-4 mb-8">
            <h3 class="h4">Filtrar por Período</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="startDate" class="label">Data de Início</label>
                    <input type="date" id="startDate" class="input" bind:value={startDate} />
                </div>
                <div>
                    <label for="endDate" class="label">Data de Fim</label>
                    <input type="date" id="endDate" class="input" bind:value={endDate} />
                </div>
            </div>
        </div>

        {#if isLoading}
            <p class="h4 text-tertiary-500 mb-4 pt-4">Carregando dados do dashboard...</p>
        {:else if error}
            <p class="text-red-500">Erro: {error}</p>
            <button class="btn variant-filled-primary mt-4" on:click={fetchQuizSummary}>Tentar Novamente</button>
        {:else if allQuizRecords.length === 0}
            <p class="h4 text-secondary-500 mb-4 pt-4">Nenhum dado de quiz disponível ainda. Comece uma missão para ver o progresso!</p>
        {:else if filteredQuizRecords.length === 0}
            <p class="h4 text-secondary-500 mb-4 pt-4">Nenhum dado encontrado para o período selecionado.</p>
        {:else}
            {#each Array.from(playersData.entries()) as [playerId, playerRecords]}
                <div class="card p-6 mb-8">
                    <h2 class="h3 text-primary-500 mb-4">Astronauta: {playerRecords[0].apelido}</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActivityChart data={processActivitySummary(playerRecords)} />
                        <OverallAccuracy data={processOverallAccuracy(playerRecords)} />
                    </div>

                    <div class="mt-8">
                        <AccuracyBySubject data={processAccuracyBySubject(playerRecords)} />
                    </div>

                    <div class="mt-8">
                        <DetailedSummary data={processDetailedSummary(playerRecords)} />
                    </div>
                </div>
            {/each}
        {/if}
    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
