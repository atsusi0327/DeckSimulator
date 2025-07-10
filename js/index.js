
function handleCredentialResponse(response) {
  // response.credential 是 JWT Token，可以傳送到後端驗證
  console.log("Google JWT Token: ", response.credential);

  // 測試成功後導向
  window.location.href = "/DeckSimulator/home"; // 注意副檔名是否正確
}