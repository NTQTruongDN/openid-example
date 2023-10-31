import useAuth, {useMe} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // @ts-ignore
  const {authenticated, getAccessToken, getUserInfo} = useAuth()
  const me = useMe();

  // @ts-ignore
  const token = getAccessToken();

  if (token && !me.value) {
    const userInfo = await getUserInfo()
    console.log(userInfo);
    if (userInfo) {
      authenticated.value = true;
      // @ts-ignore
      me.value = userInfo;

      console.log(me)
      return navigateTo('/');
    }
  }

  // if token exists and url is /login redirect to homepage
  if (token && me.value && to?.name === 'login') {
    return navigateTo('/');
  }

  if ((!token && to?.name !== 'login') || !me.value) {
    abortNavigation();
    return navigateTo('/login');
  }
})
