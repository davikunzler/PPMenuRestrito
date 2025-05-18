const form = document.getElementById('loginUserForm');
    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('http://localhost:3001/login', {
            method:'POST',
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({email, senha})
        });

        const result = await response.json();

        if(result.success){
            alert('Login bem sucedido');
            window.location.href = 'home.html';
        } else{
            alert('Usuário ou senha incorretos');
        }
    })
