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
            .eq('status', 'active')
            .order('ano_escolar', { ascending: true });

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
            lingua_portuguesa: 'Pular',
            lingua_inglesa: 'Pular',
            matematica: 'Pular',
        };

        await getPlayers();
    }

    async function deletePlayer(id) {
        const { error } = await supabase
            .from('players')
            .update({
                status: 'inactive',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Erro ao inativar jogador:', error);
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
                updated_at: new Date().toISOString(),
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
        'Ciências',
        'Educacao Física',
        'Ensino Religioso',
        'Geografia',
        'História',
        'Lingua Inglesa',
        'Lingua Portuguesa',
        'Matemática',
    ];

    let intensidades = ['Pular', 'Leve', 'Moderado', 'Intenso'];

</script>

<div class="container mx-auto py-16">

    {#if session}

            <h2 class="h3 text-secondary-500 mb-4">Jogadores</h2>
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
                
                <div class="card p-4 space-y-1">
                    <h2 class="h4 text-tertiary-500 mb-4">Editar Jogador</h2>
                    <label class="label text-sm">Jogador
                    <input class="input p-2" type="text" placeholder="Apelido" bind:value={editingPlayer.apelido} />
                    </label>
                    <label class="label text-sm">Ano Escolar
                    <select class="select" bind:value={editingPlayer.ano_escolar}>
                        {#each Array(9) as _, i}
                            <option value={i + 1}>{i + 1}º Ano</option>
                        {/each}
                    </select></label>

                    {#each disciplinas as disciplina, i}
                        <div>
                            <label class="label text-sm">{disciplina}
                            <select class="select" bind:value={editingPlayer[disciplina.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(' ', '_')]}>
                                {#each intensidades as intensidade}
                                    <option value={intensidade}>{intensidade}</option>
                                {/each}
                            </select></label>
                        </div>
                    {/each}
                    <button class="btn variant-filled-primary" on:click={updatePlayer}>Atualizar</button>
                </div>
            {/if}
            

        <div class="mt-8">
            <h2 class="h3 text-primary-500 mb-4">Adicionar Jogador</h2>
            <div class="card p-4 space-y-1">
                <label class="label text-sm">Jogador
                <input class="input p-2 text-sm" type="text" placeholder="Apelido" bind:value={newPlayer.apelido} />
                </label>
                <label class="label text-sm">Ano Escolar
                <select class="select text-sm" bind:value={newPlayer.ano_escolar}>
                    {#each Array(9) as _, i}
                        <option class="text-sm" value={i + 1}>{i + 1}º Ano</option>
                    {/each}
                </select></label>

                {#each disciplinas as disciplina, i}
                    <div>
                        <label class="label text-sm">{disciplina}
                        <select class="select" bind:value={newPlayer[disciplina.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(' ', '_')]}>
                            {#each intensidades as intensidade}
                                <option value={intensidade}>{intensidade}</option>
                            {/each}
                        </select></label>
                    </div>
                {/each}

                <button class="btn variant-filled-primary" on:click={addPlayer}>Adicionar</button>
            </div>
</div>

    {:else}
        <p>Redirecionando...</p>
    {/if}
</div>
<div class="container mx-auto py-16"></div>
