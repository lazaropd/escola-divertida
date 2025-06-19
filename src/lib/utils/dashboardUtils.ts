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
 * Filtra os registros do quiz por um período de datas.
 * @param records Registros brutos do quiz.
 * @param startDate Data de início (YYYY-MM-DD).
 * @param endDate Data de fim (YYYY-MM-DD).
 * @returns Registros filtrados.
 */
export function filterRecordsByDate(records: QuizRecord[], startDate: string | null, endDate: string | null): QuizRecord[] {
    return records.filter(record => {
        const recordDate = record.session_date;
        let pass = true;
        if (startDate && recordDate < startDate) {
            pass = false;
        }
        if (endDate && recordDate > endDate) {
            pass = false;
        }
        return pass;
    });
}

/**
 * Processa os dados brutos do quiz para um resumo de atividades por criança e data.
 * Recebe registros já filtrados para um único jogador.
 */
export function processActivitySummary(records: QuizRecord[]): PlayerActivity[] {
    const summaryMap = new Map<string, PlayerActivity>(); // Key: `${sessionDate}`

    records.forEach(record => {
        const key = record.session_date;
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
        entry.avgDecisionTime += record.decision_time_in_secs;
    });

    summaryMap.forEach(entry => {
        entry.accuracy = entry.totalQuestions > 0 ? (entry.correctQuestions / entry.totalQuestions) * 100 : 0;
        entry.avgDecisionTime = entry.totalQuestions > 0 ? entry.avgDecisionTime / entry.totalQuestions : 0;
    });

    // Ordenar por data da sessão
    return Array.from(summaryMap.values()).sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));
}

/**
 * Processa os dados brutos do quiz para a taxa de acertos geral de um único jogador.
 */
export function processOverallAccuracy(records: QuizRecord[]): PlayerAccuracyBySubject {
    let total = 0;
    let correct = 0;
    let apelido = records.length > 0 ? records[0].apelido : 'N/A';
    let playerId = records.length > 0 ? records[0].player_id : 'N/A';

    records.forEach(record => {
        total++;
        correct += record.correct_numeric;
    });

    return {
        playerId,
        apelido,
        subject: 'Geral',
        totalQuestions: total,
        correctQuestions: correct,
        accuracy: total > 0 ? (correct / total) * 100 : 0
    };
}

/**
 * Processa os dados brutos do quiz para a taxa de acertos por disciplina de um único jogador.
 */
export function processAccuracyBySubject(records: QuizRecord[]): PlayerAccuracyBySubject[] {
    const summaryMap = new Map<string, { total: number; correct: number; apelido: string; subject: string }>(); // Key: `${subject}`

    records.forEach(record => {
        const key = record.subject;
        if (!summaryMap.has(key)) {
            summaryMap.set(key, { total: 0, correct: 0, apelido: record.apelido, subject: record.subject });
        }
        const entry = summaryMap.get(key)!;
        entry.total++;
        entry.correct += record.correct_numeric;
    });

    return Array.from(summaryMap.values()).map(entry => ({
        playerId: entry.apelido,
        apelido: entry.apelido,
        subject: entry.subject,
        totalQuestions: entry.total,
        correctQuestions: entry.correct,
        accuracy: entry.total > 0 ? (entry.correct / entry.total) * 100 : 0
    })).sort((a, b) => b.accuracy - a.accuracy); // Ordena por taxa de acerto decrescente
}

/**
 * Processa os dados brutos para a tabela de resumo detalhada de um único jogador.
 */
export function processDetailedSummary(records: QuizRecord[]): DetailedQuizSummary[] {
    const summaryMap = new Map<string, {
        total: number;
        correct: number;
        apelido: string;
        subject: string;
        thematicUnit: string;
        knowledgeObject: string;
        knowledgeCode: string;
        schoolYear: number;
    }>(); // Key: `${subject}-${thematicUnit}-${knowledgeObject}-${knowledgeCode}`

    records.forEach(record => {
        const key = `${record.subject}-${record.thematic_unit}-${record.knowledge_object}-${record.knowledge_code}`;
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
        playerId: entry.apelido,
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
