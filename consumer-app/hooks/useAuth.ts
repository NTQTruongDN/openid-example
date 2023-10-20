import React from "react";

export default function useAuth() {
  const loginWithRedirect = function (e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams();
    params.set('client_id', process.env.NEXT_PUBLIC_CLIENT_ID);
    params.set('response_type', 'code');
    params.set('redirect_uri', 'http://localhost:3000/api/auth/callback/authorize-flow');
    params.set('scope', 'openid profile email');
    params.set('state', 'test123');

    window.location.href = 'http://localhost/oauth/authorize?' + params.toString()
  }

  const parseAuthorizeCodeToAccessToken = (authorize_code) => {
    const TOKEN_ENDPOINT = 'http://localhost/oauth/token';
    return fetch(TOKEN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        'grant_type': 'authorization_code',
        'client_id': process.env.NEXT_PUBLIC_CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': 'http://localhost:3000/api/auth/callback/authorize-flow',
        'code': authorize_code
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return {
    loginWithRedirect,
    parseAuthorizeCodeToAccessToken,
  }
}
