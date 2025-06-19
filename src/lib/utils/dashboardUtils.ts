// src/lib/utils/dashboardUtils.ts

export interface QuizRecord {
    created_at: string;
    player_id: string;
    user_id: string;
    apelido: string;
    knowledge_code: string;
    subject: string;
    thematic_unit: string;
    knowledge_object: string;
    school_year: number;
    is_correct: boolean;
    correct_numeric: number; // 1 for correct, 0 for incorrect
    decision_time_in_secs: number;
    time_bucket: string;
    day_of_week: string;
    hour_of_day: number;
    session_date: string; // YYYY-MM-DD
}

export interface PlayerActivity {
    playerId: string;
    apelido: string;
    sessionDate: string;
    totalQuestions: number;
    correctQuestions: number;
    accuracy: number; // Percentage
    avgDecisionTime: number; // In seconds
}

export interface PlayerAccuracyBySubject {
    playerId: string;
    apelido: string;
    subject: string;
    totalQuestions: number;
    correctQuestions: number;
    accuracy: number;
}

export interface DetailedQuizSummary {
    playerId: string;
    apelido: string;
    subject: string;
    thematicUnit: string;
    knowledgeObject: string;
    knowledgeCode: string;
    schoolYear: number;
    totalQuestions: number;
    correctQuestions: number;
    accuracy: number;
}

/**
 * Processa os dados brutos do quiz para um resumo de atividades por criança e data.
 */
export function processActivitySummary(records: QuizRecord[]): PlayerActivity[] {
    const summaryMap = new Map<string, PlayerActivity>(); // Key: `${playerId}-${sessionDate}`

    records.forEach(record => {
        const key = `${record.player_id}-${record.session_date}`;
        if (!summaryMap.has(key)) {
            summaryMap.set(key, {
                playerId: record.player_id,
                apelido: record.apelido,
                sessionDate: record.session_date,
                totalQuestions: 0,
                correctQuestions: 0,
                accuracy: 0,
                avgDecisionTime: 0
            });
        }
        const entry = summaryMap.get(key)!;
        entry.totalQuestions++;
        entry.correctQuestions += record.correct_numeric;
        // Para o tempo de decisão, vamos somar e depois calcular a média
        entry.avgDecisionTime += record.decision_time_in_secs;
    });

    // Calcular a precisão e a média do tempo de decisão
    summaryMap.forEach(entry => {
        entry.accuracy = entry.totalQuestions > 0 ? (entry.correctQuestions / entry.totalQuestions) * 100 : 0;
        entry.avgDecisionTime = entry.totalQuestions > 0 ? entry.avgDecisionTime / entry.totalQuestions : 0;
    });

    // Ordenar por apelido e data
    return Array.from(summaryMap.values()).sort((a, b) => {
        if (a.apelido < b.apelido) return -1;
        if (a.apelido > b.apelido) return 1;
        return a.sessionDate.localeCompare(b.sessionDate);
    });
}

/**
 * Processa os dados brutos do quiz para a taxa de acertos por criança.
 */
export function processAccuracyByPlayer(records: QuizRecord[]): PlayerAccuracyBySubject[] {
    const playerAccuracyMap = new Map<string, { total: number; correct: number; apelido: string }>();

    records.forEach(record => {
        if (!playerAccuracyMap.has(record.player_id)) {
            playerAccuracyMap.set(record.player_id, { total: 0, correct: 0, apelido: record.apelido });
        }
        const entry = playerAccuracyMap.get(record.player_id)!;
        entry.total++;
        entry.correct += record.correct_numeric;
    });

    return Array.from(playerAccuracyMap.entries()).map(([playerId, data]) => ({
        playerId,
        apelido: data.apelido,
        subject: 'Geral', // Indicador de que é a taxa geral
        totalQuestions: data.total,
        correctQuestions: data.correct,
        accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0
    })).sort((a, b) => a.apelido.localeCompare(b.apelido));
}

/**
 * Processa os dados brutos do quiz para a taxa de acertos por criança e disciplina.
 */
export function processAccuracyByPlayerAndSubject(records: QuizRecord[]): PlayerAccuracyBySubject[] {
    const summaryMap = new Map<string, { total: number; correct: number; apelido: string; subject: string }>(); // Key: `${playerId}-${subject}`

    records.forEach(record => {
        const key = `${record.player_id}-${record.subject}`;
        if (!summaryMap.has(key)) {
            summaryMap.set(key, { total: 0, correct: 0, apelido: record.apelido, subject: record.subject });
        }
        const entry = summaryMap.get(key)!;
        entry.total++;
        entry.correct += record.correct_numeric;
    });

    return Array.from(summaryMap.values()).map(entry => ({
        playerId: entry.apelido, // Usando apelido como ID para simplificar a exibição
        apelido: entry.apelido,
        subject: entry.subject,
        totalQuestions: entry.total,
        correctQuestions: entry.correct,
        accuracy: entry.total > 0 ? (entry.correct / entry.total) * 100 : 0
    })).sort((a, b) => {
        if (a.apelido < b.apelido) return -1;
        if (a.apelido > b.apelido) return 1;
        return a.subject.localeCompare(b.subject);
    });
}

/**
 * Processa os dados brutos para a tabela de resumo detalhada.
 */
export function processDetailedSummaryTable(records: QuizRecord[]): DetailedQuizSummary[] {
    const summaryMap = new Map<string, {
        total: number;
        correct: number;
        apelido: string;
        subject: string;
        thematicUnit: string;
        knowledgeObject: string;
        knowledgeCode: string;
        schoolYear: number;
    }>(); // Key: `${playerId}-${subject}-${thematicUnit}-${knowledgeObject}-${knowledgeCode}`

    records.forEach(record => {
        const key = `${record.player_id}-${record.subject}-${record.thematic_unit}-${record.knowledge_object}-${record.knowledge_code}`;
        if (!summaryMap.has(key)) {
            summaryMap.set(key, {
                total: 0,
                correct: 0,
                apelido: record.apelido,
                subject: record.subject,
                thematicUnit: record.thematic_unit,
                knowledgeObject: record.knowledge_object,
                knowledgeCode: record.knowledge_code,
                schoolYear: record.school_year
            });
        }
        const entry = summaryMap.get(key)!;
        entry.total++;
        entry.correct += record.correct_numeric;
    });

    return Array.from(summaryMap.values()).map(entry => ({
        playerId: entry.apelido, // Usando apelido como ID para simplificar a exibição
        apelido: entry.apelido,
        subject: entry.subject,
        thematicUnit: entry.thematicUnit,
        knowledgeObject: entry.knowledgeObject,
        knowledgeCode: entry.knowledgeCode,
        schoolYear: entry.schoolYear,
        totalQuestions: entry.total,
        correctQuestions: entry.correct,
        accuracy: entry.total > 0 ? (entry.correct / entry.total) * 100 : 0
    })).sort((a, b) => {
        if (a.subject < b.subject) return -1;
        if (a.subject > b.subject) return 1;
        return a.knowledgeCode.localeCompare(b.knowledgeCode);
    });
}
