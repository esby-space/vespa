import { Component, createResource } from "solid-js";
import trpc from "../lib/trpc";
import { useNavigate } from "@solidjs/router";

const Home: Component = () => {
    const navigate = useNavigate();
    const [user] = createResource(async() => {
        const user = await trpc.auth.query();
        console.log(user);
        if (!user) navigate("/login", { replace: true });
        return user;
    });

    return <h1>hey {user()?.username}</h1>;
};

export default Home;
