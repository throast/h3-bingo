<script lang="ts">
    import Footer from "./lib/Footer.svelte";
    import Game from "./lib/Game.svelte";
    // import Menu from "./lib/Menu.svelte";
</script>

<h1 style="color: var(--text)" class="absolute text-3xl pl-4 pt-4">H3 Bingo</h1>

<main
    style="color: var(--text); background-color: var(--main);"
    class="min-h-screen py-12 flex flex-col justify-center items-center"
>
    <Game />
</main>

<!-- <Menu /> -->

<Footer />
