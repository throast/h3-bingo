<script lang="ts">
    import defaultSquares from "./data/default-squares.json";

    const shuffledArray = <T>(array: T[]): T[] => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                shuffledArray[j],
                shuffledArray[i],
            ];
        }
        return shuffledArray;
    };

    const newGame = (size: number, squares: string[]) => {
        return shuffledArray(squares)
            .slice(0, size ** 2)
            .map((square) => {
                return { name: square, marked: false };
            });
    };

    let size = 4;
    let squares = defaultSquares.squares;
    let game = newGame(size, squares);
</script>

<main class="bg-pink-400 h-screen pt-12 flex justify-center items-center">
    <section
        class="bg-red-300 flex flex-col border-solid border-2 border-black"
    >
        {#each Array(size) as _, row}
            <div class="flex">
                {#each game.slice(row * size, (row + 1) * size) as square}
                    <div
                        class="w-32 h-32 flex justify-center items-center border-solid border-2 border-black"
                    >
                        <p>{square.name}</p>
                    </div>
                {/each}
            </div>
        {/each}
    </section>
</main>
