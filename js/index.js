window.onload = function () {
    google.accounts.id.initialize({
      client_id: '73732306444-dfm8hcn3m7s8c1hgv5dv5pj6vsir819v.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });

    document.getElementById('google-login-btn').addEventListener('click', function () {
      Pace.restart();
      google.accounts.id.prompt();
    });
}

function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    window.location.href = 'https://atsusi0327.github.io/DeckSimulator/home.html';
  }