const ingredientesData = [
    { id: 'molho', nome: 'Molho Especial', emoji: '🍯', cor: 'bg-molho' },
    { id: 'carne', nome: 'Carne', emoji: '🥩', cor: 'bg-carne' },
    { id: 'queijo', nome: 'Queijo', emoji: '🧀', cor: 'bg-queijo' },
    { id: 'alface', nome: 'Alface', emoji: '🥬', cor: 'bg-alface' },
    { id: 'tomate', nome: 'Tomate', emoji: '🍅', cor: 'bg-tomate' },
    { id: 'cebola', nome: 'Cebola Caramelizada', emoji: '🧅', cor: 'bg-cebola' },
    { id: 'bacon', nome: 'Bacon', emoji: '🥓', cor: 'bg-bacon' },
    { id: 'ovo', nome: 'Ovo', emoji: '🍳', cor: 'bg-ovo' }
];

let selecao = {};

// Inicializa os contadores
ingredientesData.forEach(ing => selecao[ing.id] = 0);

function renderMenu() {
    const grid = document.getElementById('lista-ingredientes');
    grid.innerHTML = ingredientesData.map(ing => `
        <div class="ingrediente-item">
            <span>${ing.emoji} ${ing.nome}</span>
            <div class="controls">
                <button type="button" class="btn-qty" onclick="alterar('${ing.id}', -1)">-</button>
                <span id="qty-${ing.id}">${selecao[ing.id]}</span>
                <button type="button" class="btn-qty" onclick="alterar('${ing.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

function atualizarBurgerVisual(comPaoFinal = false) {
    const display = document.getElementById('burger-display');
    display.innerHTML = '<div class="plate"></div>'; // Limpa e põe o prato

    // Sempre adicionar pão no fundo
    const paoDiv = document.createElement('div');
    paoDiv.className = 'ingrediente-visual bg-pao';
    paoDiv.innerText = 'Pão';
    display.appendChild(paoDiv);

    // Adicionar outros ingredientes
    ingredientesData.forEach(ing => {
        for (let i = 0; i < selecao[ing.id]; i++) {
            const div = document.createElement('div');
            div.className = `ingrediente-visual ${ing.cor}`;
            div.innerText = ing.nome;
            display.appendChild(div);
        }
    });

    if (comPaoFinal) {
        const paoFinalDiv = document.createElement('div');
        paoFinalDiv.className = 'ingrediente-visual bg-pao-final';
        paoFinalDiv.innerText = 'Pão';
        display.appendChild(paoFinalDiv);
    }
}

function alterar(id, delta) {
    selecao[id] = Math.max(0, selecao[id] + delta);
    document.getElementById(`qty-${id}`).innerText = selecao[id];
    atualizarBurgerVisual();
}

document.getElementById('finalizar').addEventListener('click', async function() {
    let resumo = [];
    for (const [id, qty] of Object.entries(selecao)) {
        if (qty > 0) {
            const nome = ingredientesData.find(i => i.id === id).nome;
            resumo.push(`${qty}x ${nome}`);
        }
    }

    if (resumo.length === 0) return alert("Selecione pelo menos um ingrediente!");

    // Sempre incluir 1x Pão no final
    resumo.push('1x Pão');

    const opinioes = document.getElementById('opinioes').value;
    const nomeUsuario = document.getElementById('nome').value.trim();

    if (!nomeUsuario) return alert("Por favor, digite seu nome!");

    const msg = `**Pedido de ${nomeUsuario}:**\n🍔 **Ingredientes:**\n${resumo.map(item => `- ${item}`).join('\n')}\n📝 **Observações:** ${opinioes || 'Nenhuma'}`;

    // Enviar pedido para a API backend, que por sua vez chama o webhook do Discord
    try {
        const response = await fetch('/api/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ msg })
        });
        if (response.ok) {
            atualizarBurgerVisual(true);
            alert('Pedido enviado para a cozinha! 🍔');
        } else {
            alert('Erro ao enviar: ' + response.status);
        }
    } catch (error) {
        alert('Erro de conexão: ' + error.message);
    }
});

// Inicializa a tela
renderMenu();
atualizarBurgerVisual();