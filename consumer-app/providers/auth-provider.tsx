import {createContext, useState} from "react";
import {User} from "../interfaces";

export const authContext = createContext({});

const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState<{
    user?: User
  }>({user: null});

  const setAuthData = (data: User) => {
    setAuth({user: data})
  }

  return (
    <authContext.Provider value={{auth, setAuthData}}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
