import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private'; // Esta importação é válida apenas no lado do servidor

// Define a interface para um único exercício/pergunta
interface Exercise {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export async function generateQuizQuestions(
    disciplina: string,
    unidade_tematica: string,
    objeto_de_conhecimento: string,
    codigo_objetivo_de_aprendizagem: string,
    objetivo_de_aprendizagem: string,
    ano_ensino_fundamental: number
): Promise<Exercise[]> {
    const prompt = `Gere 10 perguntas de múltipla escolha no formato JSON.

Cada item deve ter:
- question: enunciado da pergunta (string)
- options: 5 alternativas (array de strings)
- correctAnswerIndex: índice da alternativa correta (número entre 0 e 4)
- explanation: explicação da resposta correta em até 3 parágrafos (string)

As perguntas devem ser variadas e adequadas para uma criança de ${ano_ensino_fundamental + 5} anos, cursando o ${ano_ensino_fundamental}º ano do ensino fundamental, focando na disciplina de ${disciplina}, em conformidade com a BNCC Base Nacional Comum Curricular, na unidade temática "${unidade_tematica}", no objeto de conhecimento "${objeto_de_conhecimento}" e com o objetivo de aprendizagem "${codigo_objetivo_de_aprendizagem} ${objetivo_de_aprendizagem}".
Formato de saída estritamente em JSON. Nada de texto fora do JSON.`;

    console.log('[Gemini Prompt]', prompt);
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // O Gemini pode adicionar caracteres de formatação (como ```json)
        // É crucial remover qualquer texto extra antes de fazer o JSON.parse
        const jsonString = text.replace(/```json\n|```/g, '').trim();

        const exercises: Exercise[] = JSON.parse(jsonString);
        return exercises;
    } catch (error) {
        console.error("Erro ao gerar perguntas do quiz:", error);
        throw new Error("Não foi possível gerar as perguntas do quiz. Verifique a API Key, o formato da resposta do Gemini ou a conectividade.");
    }
}
