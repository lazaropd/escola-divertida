import { missionCount, missionComplete } from '$lib/stores';

export function advanceMission() {
    if ($missionCount < 11) {
        $missionCount++;
    }
    if ($missionCount === 11) {
        $missionComplete = true;
    }
}

export function resetMission() {
    $missionCount = 1;
    $missionComplete = false;
}
