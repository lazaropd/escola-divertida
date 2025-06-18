import { missionCount, missionComplete } from '$lib/stores';

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