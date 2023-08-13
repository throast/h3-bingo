<script lang="ts">
    import Footer from "./lib/Footer.svelte";
    import Game from "./lib/Game.svelte";
    import Menu from "./lib/Menu.svelte";
</script>

<h1 class="absolute text-3xl pl-4 pt-4">H3 Bingo</h1>

<main class="bg-pink-400 h-screen pt-12 flex justify-center items-center">
    <Game />
</main>

<Menu />

<Footer />
