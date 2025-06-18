<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let session;
    let user;
    let players = [];

    onMount(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        session = currentSession;

        if (!session) {
            goto('/');
        } else {
            user = session.user;
            await getPlayers();
        }
    });

    async function getPlayers() {
        const { data, error } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar jogadores:', error);
            return;
        }

        players = data;
    }

    let newPlayer = {
        apelido: '',
        ano_escolar: 1,
        arte: 'Pular',
        ciencias: 'Pular',
        educacao_fisica: 'Pular',
        ensino_religioso: 'Pular',
        geografia: 'Pular',
        historia: 'Pular',
        lingua_inglesa: 'Pular',
        lingua_portuguesa: 'Pular',
        matematica: 'Pular',
    };

    async function addPlayer() {
        const { data, error } = await supabase
            .from('players')
            .insert({
                ...newPlayer,
                user_id: user.id,
            });

        if (error) {
            console.error('Erro ao adicionar jogador:', error);
            return;
        }

        newPlayer = {
            apelido: '',
            ano_escolar: 1,
            arte: 'Pular',
            ciencias: 'Pular',
            educacao_fisica: 'Pular',
            ensino_religioso: 'Pular',
            geografia: 'Pular',
            historia: 'Pular',
            lingua_inglesa: 'Pular',
            matematica: 'Pular',
        };

        await getPlayers();
    }

    async function deletePlayer(id) {
        const { error } = await supabase
            .from('players')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao remover jogador:', error);
            return;
        }

        await getPlayers();
    }

    let editingPlayer = null;

    function editPlayer(player) {
        editingPlayer = { ...player };
    }

    async function updatePlayer() {
        const { error } = await supabase
            .from('players')
            .update({
                ...editingPlayer,
            })
            .eq('id', editingPlayer.id);

        if (error) {
            console.error('Erro ao atualizar jogador:', error);
            return;
        }

        editingPlayer = null;
        await getPlayers();
    }

    let disciplinas = [
        'Arte',
        'Ciencias',
        'Educacao Fisica',
        'Ensino Religioso',
        'Geografia',
        'Historia',
        'Lingua Inglesa',
        'Lingua Portuguesa',
        'Matematica',
    ];

    let intensidades = ['Pular', 'Leve', 'Moderado', 'Intenso'];
</script>

<div class="container mx-auto p-4">
    <h1 class="h1 text-primary-500">Perfil</h1>

    {#if session}
        <div>
            <h2 class="h2">Adicionar Jogador</h2>
            <div class="card p-4 space-y-4">
                <input class="input" type="text" placeholder="Apelido" bind:value={newPlayer.apelido} />
                <select class="select" bind:value={newPlayer.ano_escolar}>
                    {#each Array(9) as _, i}
                        <option value={i + 1}>{i + 1}º Ano</option>
                    {/each}
                </select>

                {#each disciplinas as disciplina, i}
                    <div>
                        <label class="label">{disciplina}</label>
                        <select class="select" bind:value={newPlayer[disciplina.toLowerCase().replace(' ', '_')]}>
                            {#each intensidades as intensidade}
                                <option value={intensidade}>{intensidade}</option>
                            {/each}
                        </select>
                    </div>
                {/each}

                <button class="btn variant-filled-primary" on:click={addPlayer}>Adicionar</button>
            </div>

            <h2 class="h2 mt-8">Jogadores</h2>
            {#each players as player}
                <div class="card p-4 mt-4 flex justify-between items-center">
                    <div>
                        <p class="text-lg font-bold">{player.apelido}</p>
                        <p class="text-sm">Ano Escolar: {player.ano_escolar}º</p>
                    </div>
                    <div>
                        <button class="btn variant-filled-secondary mr-2" on:click={() => editPlayer(player)}>Editar</button>
                        <button class="btn variant-filled-error" on:click={() => deletePlayer(player.id)}>Remover</button>
                    </div>
                </div>
            {/each}

            {#if editingPlayer}
                <div class="card p-4 mt-4">
                    <h3 class="h3">Editar Jogador</h3>
                    <input class="input" type="text" placeholder="Apelido" bind:value={editingPlayer.apelido} />
                    <select class="select" bind:value={editingPlayer.ano_escolar}>
                        {#each Array(9) as _, i}
                            <option value={i + 1}>{i + 1}º Ano</option>
                        {/each}
                    </select>

                    {#each disciplinas as disciplina, i}
                        <div>
                            <label class="label">{disciplina}</label>
                            <select class="select" bind:value={editingPlayer[disciplina.toLowerCase().replace(' ', '_')]}>
                                {#each intensidades as intensidade}
                                    <option value={intensidade}>{intensidade}</option>
                                {/each}
                            </select>
                        </div>
                    {/each}
                    <button class="btn variant-filled-primary" on:click={updatePlayer}>Atualizar</button>
                </div>
            {/if}
        </div>
    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
