import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private'; // Importa a chave da API de variáveis de ambiente privadas

// Define a interface para um único exercício/pergunta
interface Exercise {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

// Inicializa o cliente da API do Gemini
// Certifique-se de que GEMINI_API_KEY esteja configurada nas suas variáveis de ambiente.
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Escolha o modelo apropriado. 'gemini-pro' é um bom ponto de partida.
// 'gemini-1.5-flash' ou 'gemini-1.5-pro' podem ser usados se tiver acesso e preferir.
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Gera uma lista de exercícios de múltipla escolha usando a API do Gemini.
 *
 * @param disciplina Nome da disciplina (ex: "Matemática", "História").
 * @param unidade_tematica Unidade temática (ex: "Números", "O mundo moderno").
 * @param objeto_de_conhecimento Objeto de conhecimento (ex: "Sistema de numeração decimal", "Revolução Industrial").
 * @param objetivo_de_aprendizagem Objetivo de aprendizagem (ex: "Identificar e comparar números naturais", "Compreender as causas e consequências da Revolução Industrial").
 * @param ano_ensino_fundamental Ano do ensino fundamental (ex: 5).
 * @param idade_crianca Idade da criança (ex: 10).
 * @returns Uma Promise que resolve para uma lista de exercícios (Exercise[]) ou rejeita em caso de erro.
 */
export async function generateQuizQuestions(
    disciplina: string,
    unidade_tematica: string,
    objeto_de_conhecimento: string,
    objetivo_de_aprendizagem: string,
    ano_ensino_fundamental: number,
    idade_crianca: number
): Promise<Exercise[]> {
    const prompt = `Gere 10 perguntas de múltipla escolha no formato JSON.

Cada item deve ter:
- question: enunciado da pergunta (string)
- options: 5 alternativas (array de strings)
- correctAnswerIndex: índice da alternativa correta (número entre 0 e 4)
- explanation: breve explicação da resposta correta (string)

As perguntas devem ser variadas e adequadas para uma criança de ${idade_crianca} anos, cursando o ${ano_ensino_fundamental}º ano do ensino fundamental, focando na disciplina de ${disciplina}, na unidade temática "${unidade_tematica}", no objeto de conhecimento "${objeto_de_conhecimento}" e com o objetivo de aprendizagem "${objetivo_de_aprendizagem}".
Formato de saída estritamente em JSON. Nada de texto fora do JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Tenta parsear o texto como JSON
        // É importante que a resposta do Gemini seja *apenas* o JSON.
        const exercises: Exercise[] = JSON.parse(text);
        return exercises;
    } catch (error) {
        console.error("Erro ao gerar perguntas do quiz:", error);
        // Lança um erro mais descritivo para ser tratado pelo código que chama esta função
        throw new Error("Não foi possível gerar as perguntas do quiz. Verifique a API Key, o formato da resposta do Gemini ou a conectividade.");
    }
}
