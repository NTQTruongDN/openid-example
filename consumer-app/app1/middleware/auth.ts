import useAuth from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  // @ts-ignore
  const {authenticated} = useAuth()
  const {app} = useRuntimeConfig()

  // @ts-ignore
  const token = useCookie(app.auth.tokenKey);

  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    return navigateTo('/');
  }

  if (!token.value && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/login');
  }
})
