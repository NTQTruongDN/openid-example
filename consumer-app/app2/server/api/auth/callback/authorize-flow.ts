export default defineEventHandler((event) => {
  // @ts-ignore
  const query = getQuery(event);
  // @ts-ignore
  const {app} = useRuntimeConfig()

  console.log(query);

  // const TOKEN_ENDPOINT = app.auth.authServer + '/oauth/token';
  // $fetch(TOKEN_ENDPOINT, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     'grant_type': 'authorization_code',
  //     'client_id': app.auth.clientId,
  //     'client_secret': app.auth.clientSecret,
  //     'redirect_uri': app.auth.callback,
  //     'code': query.code
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }).then((res: any) => {
  //   console.log(res);
  //   setCookie(event, 'tk', res.access_token);
  // }).catch((err: any) => {
  //   //TODO: Handle Authorize failed
  //   console.error(err)
  // });
})
