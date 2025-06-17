import { json } from '@sveltejs/kit';
import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { PageServerLoad } from './$types';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

export const POST: PageServerLoad = async ({ request }) => {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return json({ error: 'Prompt is required' }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return json({ content: text });
    } catch (error) {
        console.error('Erro ao gerar conteúdo:', error);
        return json({ error: 'Failed to generate content' }, { status: 500 });
    }
};
