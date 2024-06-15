import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageLayout from "../layouts/layout";
import Login from "../pages/login/page";
import Register from "../pages/register/page";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Halaman404 from "../pages/404page/page";
import Home from "../pages/home/page";
import Lists from "../pages/lists/page";
import Boards from "../pages/boards/page";
import Members from "../pages/members/page";
import Settings from "../pages/settings/page";

export default function Routes() {
  return (
    <Router>
      <React.StrictMode>
        <Switch>
          <PrivateRoute path="/home" exact>
            <PageLayout>
              <Home />
            </PageLayout>
          </PrivateRoute>
          <PrivateRoute path="/home/boards" exact>
            <PageLayout>
              <Boards />
            </PageLayout>
          </PrivateRoute>
          <PrivateRoute path="/home/lists" exact>
            <PageLayout>
              <Lists />
            </PageLayout>
          </PrivateRoute>
          <PrivateRoute path="/home/members" exact>
            <PageLayout>
              <Members />
            </PageLayout>
          </PrivateRoute>
          <PrivateRoute path="/home/settings" exact>
            <PageLayout>
              <Settings />
            </PageLayout>
          </PrivateRoute>
          <PublicRoute path="/Register" exact>
            <Register />
          </PublicRoute>
          <PublicRoute path="/" exact>
            <Login />
          </PublicRoute>
          <Route path="*">
            <Halaman404 />
          </Route>
        </Switch>
      </React.StrictMode>
    </Router>
  );
}
