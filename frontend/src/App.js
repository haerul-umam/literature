import { Route, Switch } from "react-router-dom"
import { useContext, useEffect } from "react";
import {AuthContext} from "./context/authContext"
import {setAuthToken, API} from "./config/api"
import { PrivateRouteUser, PrivateRouteAdmin, AuthOnlyRoute } from "./config/privateRoute";
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import AddLiteratur from "./pages/AddLiteratur";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import DetailLiteratur from "./pages/DetailLiteratur"
import MyCollection from "./pages/MyCollection"
import Root from "./pages/Root";


setAuthToken(localStorage.token)

function App() {
  const [,dispatchUser] = useContext(AuthContext)

  const checkAuth = async () => {
    try{
      if (localStorage.token){
        setAuthToken(localStorage.getItem("token"))

        const response = await API.get("/auth")
      
        let payload = response.data.checkAuth
        payload.token = localStorage.token
        dispatchUser({
          type: "AUTH_SUCCESS",
          payload
        })
      }else{
        dispatchUser({type:"AUTH_ERROR"})
      }

    }catch(e){
      console.log(e)
      dispatchUser({type:"AUTH_ERROR"})
    }
  }

  useEffect(() => {
    checkAuth()
    //eslint-disable-next-line
  },[])

  return (
    <>
      <Switch>
        <Route exact path="/" component={Root} />
        <AuthOnlyRoute path="/literature/:id" component={DetailLiteratur} />
        <AuthOnlyRoute path="/search" component={Search}/>
        <PrivateRouteUser path="/add-literatur" component={AddLiteratur} />
        <PrivateRouteUser path="/profile" component={Profile} />
        <PrivateRouteUser path="/my-collections" component={MyCollection} />
        <PrivateRouteAdmin path="/book-verify" component={Admin} />
      </Switch>
    </>
  );
}

export default App;
