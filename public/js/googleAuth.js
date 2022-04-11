async function validateGoogleToken(googleResponse) {
    let response = await fetch('http://localhost:3000/login', {
    method: "POST",
    headers: {"Content-type": "application/json; charset=UTF-8"},
    body: googleResponse.credential
    });
    return response;
  }
  
  async function googleCallback(googleResponse) {
    let authorizedToken = await validateGoogleToken(googleResponse);
    createSessionCookie('google-session-token', googleResponse.credential, 7);
  }
  
  function createSessionCookie(cookieName, cookieValue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
  }
  
  function deleteSessionCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }