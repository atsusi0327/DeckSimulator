let tokenClient;

function navigateToLang(lang) {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("Error");
        return;
    }

    window.location.href = `views/${lang}/decklist`; 
}

window.onload = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '73732306444-dfm8hcn3m7s8c1hgv5dv5pj6vsir819v.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            localStorage.setItem("access_token", accessToken);
            console.log("Access token saved");
        }
    });

    // 如果沒有 access token 就請求一個
    if (!localStorage.getItem("access_token")) {
        tokenClient.requestAccessToken();
    }
};