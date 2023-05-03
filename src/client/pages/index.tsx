import { Component, createResource } from "solid-js";
import { render } from "solid-js/web";
import trpc from "../lib/trpc";

const App: Component = () => {
    const [user] = createResource(async() => {
        const user = await trpc.auth.query();
        if (!user) window.location.href = "/login";
        return user;
    });

    return (
        <>
            <h1>hey {user()?.username}</h1>
        </>
   );
};

render(() => <App />, document.querySelector("#app") as HTMLElement);
