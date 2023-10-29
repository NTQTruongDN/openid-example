import {ref, reactive, toRefs} from 'vue';
import {integer} from "vscode-languageserver-types";
import {randomBytes, } from "crypto";

const authenticated = ref(false);
const me = reactive({});

export default function useAuth() {
  const {app} = useRuntimeConfig()

  const loginWithSSOSever = () => {
    const params = new URLSearchParams();
    // @ts-ignore
    params.set('client_id', app.auth.clientId);
    params.set('response_type', 'code');
    // @ts-ignore
    params.set('redirect_uri', app.auth.callback);
    params.set('scope', 'openid');

    let state = localStorage.getItem('auth_state');
    if(!state) {
      state = generateState();
    }
    params.set('state', state);
    params.set('code_challenge', sha256(generateCodeVerifier()))
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
        'client_secret': app.auth.clientSecret,
        'redirect_uri': app.auth.callback,
        'code': auth_code
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res: any) => {
      console.log(res);

      localStorage.setItem(app.auth.tokenKey, res.accessToken);
      authenticated.value = true;

      navigateTo('/');
    }).catch((err: any) => {
      //TODO: Handle Authorize failed
      console.error(err)
    });
  }

  const generateState = () => {
    const state = btoa(random().toString());
    localStorage.setItem('auth_state', state);
    return state;
  }


  const generateCodeVerifier = () => {
    return btoa(random().toString());
  }
  
  const random  = (byte: integer = 32) => {
    const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.';
  let random = '';
  const randomValues = Array.from(
    window.crypto.getRandomValues(new Uint8Array(43))
  );
  randomValues.forEach(v => (random += charset[v % charset.length]));
  return random;
  }

  const getCrypto = () => window.crypto;

  const sha256 = async (s: string) => {
    const digestOp: any = getCrypto().subtle.digest(
      { name: 'SHA-256' },
      new TextEncoder().encode(s)
    );
  
    return await digestOp;
  };

  return {
    authenticated,
    ...toRefs(me),
    loginWithSSOSever,
    exchangeCodeToken
  }
}
