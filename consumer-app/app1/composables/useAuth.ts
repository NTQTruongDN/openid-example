import {ref, reactive, toRefs} from 'vue';
import {randomBits} from "iron-webcrypto";
import {integer} from "vscode-languageserver-types";
import {randomBytes} from "crypto";

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
    params.set('state', generateState());

    // @ts-ignore
    window.location.href = app.auth.authServer + '/oauth/authorize?' + params.toString()
  }

  const exchangeCodeToken = (auth_code: string) => {
    const {app} = useRuntimeConfig();
    debugger;

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
    return random().toString();
  }


  const generateCodeVerifier = () => {

  }

  const generateNonce = () => {

  }

  const random  = (byte: integer = 32) => randomBytes(byte)

  return {
    authenticated,
    ...toRefs(me),
    loginWithSSOSever,
    exchangeCodeToken
  }
}
