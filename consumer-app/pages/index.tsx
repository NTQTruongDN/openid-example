import Container from '../components/container'
import useAuth from "../hooks/useAuth";
import {useState} from "react";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false)
  const {loginWithRedirect} = useAuth()
  return (
    <>
      <Container>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">
            Hey, This is a consumer app!
          </h1>
          {
            isAuthenticated ?
              <h1 className="text-2xl font-bold">
                TADA!!! Authenticated!
              </h1>
              :
              <>
                <p>
                  Click the login button for test the authorization flow
                </p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={(e) => loginWithRedirect(e)}>
                  Login with my own Identity provider
                </button>
              </>
          }
        </div>
      </Container>
    </>
  )
}

export default HomePage
