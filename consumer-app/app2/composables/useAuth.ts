import {ref, reactive, toRefs} from 'vue';
import {useCookie, useState} from "nuxt/app";

const authenticated = ref(false);
export const useMe = () => useState('me', () => ({}));

export default function useAuth() {
  const {app} = useRuntimeConfig()
  const me = useMe();

  const loginWithSSOSever = async () => {
    const params = new URLSearchParams();
    // @ts-ignore
    params.set('client_id', app.auth.clientId);
    params.set('response_type', 'code');
    // @ts-ignore
    params.set('redirect_uri', app.auth.callback);
    params.set('scope', 'openid');

    let state = _getAuthState() || generateState();
    params.set('state', state);

    const code_challenge = await generateCodeChallenge(generateCodeVerifier());

    params.set('code_challenge', code_challenge)
    params.set('code_challenge_method', 'S256')

    // @ts-ignore
    window.location.href = app.auth.authServer + '/oauth/authorize?' + params.toString()
  }

  const exchangeCodeToken = (auth_code: string) => {
    const {app} = useRuntimeConfig();
    const TOKEN_ENDPOINT = app.auth.authServer + '/oauth/token';

    $fetch(TOKEN_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        'grant_type': 'authorization_code',
        'client_id': app.auth.clientId,
        'code_verifier': _getCodeVerifier(),
        'redirect_uri': app.auth.callback,
        'code': auth_code
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res: any) => {
      _setAccessToken(res.access_token, res.type)

      getUserInfo().then((data) => {
        // @ts-ignore
        me.value = data;
        authenticated.value = true;
        navigateTo('/');
      })
    }).catch((err: any) => {
      //TODO: Handle Authorize failed
      console.error(err)
      alert(err);
    });
  }

  const getUserInfo = async () => {
    return await $fetch('http://localhost/api/me', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getAccessToken()
      }
    });
  }

  const _setAccessToken = (access_token: string, type: string) => {
    let cookie = useCookie('_atk')
    cookie.value = access_token;
  }

  const getAccessToken = () => {
    let cookie = useCookie('_atk')
    return cookie.value;
  }

  const validateCallbackParams = (query: any) => {
    if (!query.hasOwnProperty('code') && !query?.code.length) {
      throw Error('Missing code params!')
    }

    const state = _getAuthState();
    if (!state || !query.hasOwnProperty('state') || (state && state !== query.state)) {
      throw Error('Wrong State!')
    }
  }

  const _getAuthState = () => sessionStorage.getItem('_ast')

  const _getCodeVerifier = () => sessionStorage.getItem('_cv')

  const generateState = () => {
    const state = btoa(random().toString());
    sessionStorage.setItem('_ast', state);
    return state;
  }

  const generateCodeVerifier = () => {
    const code_verifier = random().toString();
    sessionStorage.setItem('_cv', code_verifier);

    return code_verifier;
  }

  const random = (byte = 32) => {
    const charset =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let random = '';
    const randomValues = Array.from(
      getCrypto().getRandomValues(new Uint8Array(43))
    );
    randomValues.forEach(v => (random += charset[v % charset.length]));
    return random;
  }

  const getCrypto = () => window.crypto;

  const generateCodeChallenge = async (s: string): Promise<string> => {
    const digestOp: ArrayBuffer = await getCrypto().subtle.digest(
      {name: 'SHA-256'},
      new TextEncoder().encode(s)
    );

    return btoa(String.fromCharCode(...new Uint8Array(digestOp)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  return {
    authenticated,
    loginWithSSOSever,
    exchangeCodeToken,
    validateCallbackParams,
    getAccessToken,
    getUserInfo
  }
}
