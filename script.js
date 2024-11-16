// Configuração do Firebase - Substitua com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyCttg-_ybWS2D9ZrNjZv1jdpUKn8M8bfDw",
    authDomain: "baurulista.firebaseapp.com",
    databaseURL: "https://baurulista-default-rtdb.firebaseio.com",
    projectId: "baurulista",
    storageBucket: "baurulista.firebasestorage.app",
    messagingSenderId: "878200052221",
    appId: "1:878200052221:web:5b6c9e994cddb4b66be194"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referência para a lista de espera no banco de dados
const listaRef = database.ref('listaDeEspera');

// Função para adicionar cliente
function adicionarCliente() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const carro = document.getElementById('carro').value;

    if (nome && telefone && carro) {
        const cliente = {
            nome,
            telefone,
            carro,
            data: new Date().toISOString()
        };

        // Adiciona ao Firebase
        listaRef.push(cliente)
            .then(() => {
                limparFormulario();
            })
            .catch((error) => {
                alert('Erro ao adicionar cliente: ' + error.message);
            });
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

// Função para remover cliente
function removerCliente(clienteId) {
    listaRef.child(clienteId).remove()
        .catch((error) => {
            alert('Erro ao remover cliente: ' + error.message);
        });
}

// Função para atualizar a tabela
function atualizarTabela(snapshot) {
    const tbody = document.getElementById('listaClientes');
    tbody.innerHTML = '';

    snapshot.forEach((childSnapshot) => {
        const cliente = childSnapshot.val();
        const clienteId = childSnapshot.key;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.carro}</td>
            <td>
                <button class="btn-remover" onclick="removerCliente('${clienteId}')">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para limpar formulário
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('carro').value = '';
}

// Listener para mudanças no banco de dados
window.onload = function() {
    // Carrega o tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Escuta mudanças na lista de espera
    listaRef.on('value', (snapshot) => {
        atualizarTabela(snapshot);
    });
};

// Funções do tema (mantidas as mesmas)
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
} 