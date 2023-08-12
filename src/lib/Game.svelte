<script lang="ts">
    import defaultCard from "./data/default-card.json";
</script>

<main class="bg-pink-400 h-screen pt-12 flex justify-center items-center">
    <section class="bg-red-300 flex flex-wrap w-full max-w-xl">
        {#each defaultCard.squares as square}
            <p class="w-32 h-32 border-solid border-2 border-black">{square}</p>
        {/each}
    </section>
</main>
