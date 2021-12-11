import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import Loading from "../components/Loading/Loading"

export function PrivateRouteUser({component: Component,role,...rest}){
    const [stateUser,] = useContext(AuthContext)
    function check(props){
        if (!localStorage.token || stateUser.user.role === "admin") return <Redirect to="/book-verify" />
        if (stateUser.user.role === "user") return <Component {...props}/>
        return <Loading />
    }

    return (
        <Route {...rest} render={(props) => (check(props))} />
    )

}

export function PrivateRouteAdmin({component: Component,...rest}){
    const [stateUser,] = useContext(AuthContext)
    function check(props){
        if (!localStorage.token || stateUser.user.role === "user") return <Redirect to="/" />
        if (stateUser.user.role === "admin") return <Component {...props}/>
        return <Loading />
    }

    return (
        <Route {...rest} render={(props) => (check(props))} />
    )

}

export function AuthOnlyRoute({component: Component,...rest}){
    const [stateUser,] = useContext(AuthContext)
    function check(props){
        if (!localStorage.token) return <Redirect to="/" />
        if (stateUser.isLogin) return <Component {...props}/>
        return <Loading />
    }

    return (
        <Route {...rest} render={(props) => (check(props))} />
    )

}

