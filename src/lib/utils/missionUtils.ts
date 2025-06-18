import { missionCount, missionComplete } from '$lib/stores';
import { supabase } from '$lib/supabaseClient'; // Importa o cliente Supabase

export function advanceMission() {
	missionCount.update(count => {
		const next = count + 1;
		if (next === 11) {
			missionComplete.set(true);
		}
		return next > 11 ? count : next;
	});
}

export function resetMission() {
    missionCount.set(1);
    missionComplete.set(false);
	window.location.reload();
}

export function getSubject(player) {
	const pesoDisciplinas = {
		'Leve': 1,
		'Moderado': 3,
		'Intenso': 9
	};

	const disciplinas = [
		{ nome: 'arte', valor: player.arte },
		{ nome: 'ciencias', valor: player.ciencias },
		{ nome: 'educacao_fisica', valor: player.educacao_fisica },
		{ nome: 'ensino_religioso', valor: player.ensino_religioso },
		{ nome: 'geografia', valor: player.geografia },
		{ nome: 'historia', valor: player.historia },
		{ nome: 'lingua_inglesa', valor: player.lingua_inglesa },
		{ nome: 'lingua_portuguesa', valor: player.lingua_portuguesa },
		{ nome: 'matematica', valor: player.matematica }
	];

	const sorteioArray: string[] = [];

	for (const d of disciplinas) {
		const peso = pesoDisciplinas[d.valor] || 0;
		for (let i = 0; i < peso; i++) {
			sorteioArray.push(d.nome);
		}
	}

	const subject = sorteioArray.length > 0
		? sorteioArray[Math.floor(Math.random() * sorteioArray.length)]
		: undefined;

	return {
		...player,
		disciplinas: sorteioArray,
		disciplina: subject
	};
}

/**
 * Registra uma tentativa de quiz no banco de dados.
 * @param playerId O ID do jogador.
 * @param userId O ID do usuário associado à sessão.
 * @param codigoObjetivo O código do objetivo de aprendizagem da BNCC.
 * @param disciplina A disciplina da pergunta.
 * @param anoEscolar O ano escolar do jogador.
 * @param question O enunciado da pergunta.
 * @param options As opções da pergunta.
 * @param correctAnswerIndex O índice da resposta correta.
 * @param userAnswerIndex O índice da resposta selecionada pelo usuário.
 * @param explanation A explicação da resposta.
 */
export async function recordQuizAttempt(
    playerId: string,
    userId: string,
    codigoObjetivo: string,
    disciplina: string,
    anoEscolar: number,
    question: string,
    options: string[],
    correctAnswerIndex: number,
    userAnswerIndex: number,
    explanation: string
) {
    try {
        const { data, error } = await supabase
            .from('quiz')
            .insert([
                {
                    player_id: playerId,
                    user_id: userId,
                    codigo_objetivo_de_aprendizagem: codigoObjetivo,
                    disciplina: disciplina,
                    ano_escolar: anoEscolar,
                    question: question,
                    options: options,
                    correct_answer_index: correctAnswerIndex,
                    user_answer_index: userAnswerIndex,
                    explanation: explanation
                }
            ]);

        if (error) {
            console.error('Erro ao registrar tentativa do quiz:', error);
            throw error;
        }
        console.log('Tentativa do quiz registrada com sucesso:', data);
    } catch (error) {
        console.error('Falha ao registrar tentativa do quiz:', error);
    }
}
