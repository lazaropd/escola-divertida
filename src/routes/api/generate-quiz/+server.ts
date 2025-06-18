import { json } from '@sveltejs/kit';
import { generateQuizQuestions } from '$lib/utils/quizGenerator';

// Define a interface para os parâmetros de entrada
interface QuizParams {
    disciplina: string;
    unidade_tematica: string;
    objeto_de_conhecimento: string;
    codigo_objetivo_de_aprendizagem: string;
    objetivo_de_aprendizagem: string;
    ano_ensino_fundamental: number;
}

/**
 * Manipula requisições POST para gerar perguntas do quiz.
 * Este endpoint é executado no servidor.
 */
export async function POST({ request }) {
    try {
        const {
            disciplina,
            unidade_tematica,
            objeto_de_conhecimento,
            codigo_objetivo_de_aprendizagem,
            objetivo_de_aprendizagem,
            ano_ensino_fundamental
        }: QuizParams = await request.json();

        if (!disciplina || !unidade_tematica || !objeto_de_conhecimento || !objetivo_de_aprendizagem || !ano_ensino_fundamental || !codigo_objetivo_de_aprendizagem) {
            return json({ error: 'Parâmetros de quiz incompletos.' }, { status: 400 });
        }

        const exercises = await generateQuizQuestions(
            disciplina,
            unidade_tematica,
            objeto_de_conhecimento,
            codigo_objetivo_de_aprendizagem,
            objetivo_de_aprendizagem,
            ano_ensino_fundamental
        );

        return json({ exercises });
    } catch (error) {
        console.error('Erro no endpoint /api/generate-quiz:', error);
        return json({ error: 'Falha ao gerar perguntas do quiz.' }, { status: 500 });
    }
}
