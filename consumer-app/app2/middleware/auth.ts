import useAuth, {useMe} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  // @ts-ignore
  const {authenticated, getAccessToken, getUserInfo} = useAuth()
  const me = useMe();

  // @ts-ignore
  const token = getAccessToken();

  if (token) {
    // check if value exists
    getUserInfo().then((res) => {
      authenticated.value = true;
      // @ts-ignore
      me.value = res;

      navigateTo('/')
      return;
    });
  }

  // if token exists and url is /login redirect to homepage
  if (me.value && to?.name === 'login') {
    return navigateTo('/');
  }

  if (!token && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/login');
  }
})
