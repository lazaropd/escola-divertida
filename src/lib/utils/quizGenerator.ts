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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export async function generateQuizQuestions(
    disciplina: string,
    unidade_tematica: string,
    objeto_de_conhecimento: string,
    codigo_objetivo_de_aprendizagem: string,
    objetivo_de_aprendizagem: string,
    ano_ensino_fundamental: number
): Promise<Exercise[]> {
    const prompt = `

Gere 10 perguntas de múltipla escolha no formato JSON.

Cada item deve conter as seguintes propriedades:
- question: o enunciado da pergunta (string)
- options: uma lista com 5 alternativas plausíveis (array de strings)
- correctAnswerIndex: um número entre 0 e 4 representando o índice correto
- explanation: explicação da resposta correta (string, até 3 parágrafos, com linguagem simples, divertida, adequada para crianças)

As perguntas devem ser variadas, interessantes, práticas, com linguagem adaptada a uma criança de ${ano_ensino_fundamental + 5} anos, cursando o ${ano_ensino_fundamental}º ano do ensino fundamental. Use como base a disciplina "${disciplina}", a unidade temática "${unidade_tematica}", o objeto de conhecimento "${objeto_de_conhecimento}" e o objetivo "${codigo_objetivo_de_aprendizagem} ${objetivo_de_aprendizagem}", conforme a BNCC.

A explicação deve despertar a curiosidade e ser acessível à idade. Pode usar metáforas ou comparações criativas para facilitar o entendimento.

**Importante**:
- A alternativa correta **deve estar embaralhada entre as 5 opções**, não devendo seguir padrões fixos como aparecer sempre nas posições 1, 2 ou 3.
- Escolha o índice correto de forma **aleatória** entre 0 e 4 para cada pergunta, e então posicione a resposta certa nesse índice.
- Verifique que correctAnswerIndex realmente corresponde ao conteúdo correto dentro da lista options.

Formato de saída: apenas um JSON válido contendo um array com os 10 objetos descritos. Não inclua nenhum texto fora do JSON.

`;

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
