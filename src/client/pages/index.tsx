import { Component } from "solid-js";
import { render } from "solid-js/web";

const App: Component = () => <h1>hello world?</h1>;
render(() => <App />, document.querySelector("#app") as HTMLElement);
