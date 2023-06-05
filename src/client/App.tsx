import { Component } from "solid-js";
import { Router, Route, Routes } from "@solidjs/router";
import { render } from "solid-js/web";

import Home from "./pages/home";
import Login from "./pages/login";

const App: Component = () => (
    <Router>
        <Routes>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
        </Routes>
    </Router>
);

render(() => <App />, document.querySelector("#app") as HTMLElement);

