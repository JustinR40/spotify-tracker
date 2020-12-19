import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Authentication from "./components/Authentication";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
function App() {
    return (
        <Router>
            <Switch>
                <Route path="/auth">
                    <Authentication />
                </Route>
                <Route path="/dash">
                    <Dashboard />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
