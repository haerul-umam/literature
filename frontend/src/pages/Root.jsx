import { AuthContext } from "../context/authContext"
import { useContext } from "react"
import Landing from "./Landing"
import Home from "./Home"
import Loading from "../components/Loading/Loading"

export default function Root() {
    const [stateUser,] = useContext(AuthContext)

    const conditionalRender = () => {
        if (stateUser.isLoading) return <Loading />
        if (stateUser.isLogin) return <Home />
        return <Landing/>
    }

    return (
        <>  
            {conditionalRender()}
        </>
    )
}
