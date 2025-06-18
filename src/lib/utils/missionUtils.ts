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
}
