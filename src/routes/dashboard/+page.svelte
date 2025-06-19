<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {
        processActivitySummary,
        processAccuracyByPlayer,
        processAccuracyByPlayerAndSubject,
        processDetailedSummaryTable,
        type QuizRecord
    } from '$lib/utils/dashboardUtils';

    import ActivitySummary from '$lib/components/dashboard/ActivitySummary.svelte';
    import AccuracyRateByPlayer from '$lib/components/dashboard/AccuracyRateByPlayer.svelte';
    import AccuracyRateByPlayerAndSubject from '$lib/components/dashboard/AccuracyRateByPlayerAndSubject.svelte';
    import DetailedSummaryTable from '$lib/components/dashboard/DetailedSummaryTable.svelte';

    let session;
    let user;
    let isLoading = true;
    let error: string | null = null;
    let quizRecords: QuizRecord[] = [];

    // Dados processados para os componentes
    let activitySummaryData: any[] = [];
    let accuracyByPlayerData: any[] = [];
    let accuracyByPlayerAndSubjectData: any[] = [];
    let detailedSummaryTableData: any[] = [];

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/login'); // Redireciona para login se não houver sessão
            return;
        } else {
            user = session.user;
            await fetchQuizSummary();
        }
    });

    async function fetchQuizSummary() {
        isLoading = true;
        error = null;
        try {
            // Certifique-se de que 'quiz_summary' é uma view ou tabela acessível
            // e que as políticas RLS estão configuradas corretamente para 'user_id'.
            const { data, error: dbError } = await supabase
                .from('quiz_summary')
                .select('*')
                .eq('user_id', user.id); // Filtra por user_id para RLS

            if (dbError) {
                console.error('Erro ao buscar resumo do quiz:', dbError);
                throw new Error('Falha ao carregar dados do dashboard.');
            }

            quizRecords = data || [];
            processData(); // Processa os dados após a busca
        } catch (e) {
            error = (e as Error).message;
        } finally {
            isLoading = false;
        }
    }

    function processData() {
        activitySummaryData = processActivitySummary(quizRecords);
        accuracyByPlayerData = processAccuracyByPlayer(quizRecords);
        accuracyByPlayerAndSubjectData = processAccuracyByPlayerAndSubject(quizRecords);
        detailedSummaryTableData = processDetailedSummaryTable(quizRecords);
    }
</script>

<div class="container mx-auto py-16">
    <h1 class="h3 text-primary-500">Dashboard de Progresso</h1>

    {#if isLoading}
        <p class="h4 text-tertiary-500 mb-4 pt-4">Carregando dados do dashboard...</p>
    {:else if error}
        <p class="text-red-500">Erro: {error}</p>
        <button class="btn variant-filled-primary mt-4" on:click={fetchQuizSummary}>Tentar Novamente</button>
    {:else if quizRecords.length === 0}
        <p class="h4 text-secondary-500 mb-4 pt-4">Nenhum dado de quiz disponível ainda. Comece uma missão para ver o progresso!</p>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <ActivitySummary data={activitySummaryData} />
            <AccuracyRateByPlayer data={accuracyByPlayerData} />
        </div>

        <div class="mt-8">
            <AccuracyRateByPlayerAndSubject data={accuracyByPlayerAndSubjectData} />
        </div>

        <div class="mt-8">
            <DetailedSummaryTable data={detailedSummaryTableData} />
        </div>
    {/if}
</div>
