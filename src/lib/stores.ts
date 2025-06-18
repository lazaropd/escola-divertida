import { writable } from 'svelte/store';

import { writable } from 'svelte/store';

export const session = writable(null);
export const missionCount = writable(1);
export const missionComplete = writable(false);
export const selectedPlayer = writable(null);

