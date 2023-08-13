<script lang="ts">
    import defaultSquares from "./data/default-squares.json";

    const markSquare = (square: { name: string; marked: boolean }) => {
        square.marked = !square.marked;
        game = [...game];
    };

    const handleSquareKeys = (e: Event) => {
        return "sup";
    };

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
        if (squares.length < size ** 2) {
            let delta = size ** 2 - squares.length;
            for (let i = 0; i < delta; i++) {
                let j = i < squares.length ? i : i % squares.length;
                squares.push(squares[j]);
            }
        }
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
                        on:click={() => markSquare(square)}
                        on:keydown={handleSquareKeys}
                        tabindex="0"
                        role="switch"
                        aria-checked={square.marked}
                        class="relative w-32 h-32 flex justify-center items-center border-solid border-2 border-black"
                    >
                        <p>{square.name}</p>
                        <div>{square.marked}</div>
                    </div>
                {/each}
            </div>
        {/each}
    </section>
</main>
