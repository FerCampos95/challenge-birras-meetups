import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "../components/home/Home";
import Login from "../components/login/Login";
import SingUp from "../components/login/SingUp";
import Pagina404 from "../components/404/Pagina404";
// import Footer from '../components/Footer'

export function AppRouter() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/singup' component={SingUp} />
        <Route exact path='/' component={Home} />
        <Route exact path='/home' component={Home} />
        <Route path='*' component={Pagina404} />
      </Switch>
      {/* <Footer></Footer> */}
    </BrowserRouter>
  );
}