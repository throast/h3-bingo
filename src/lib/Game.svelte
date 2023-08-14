<script lang="ts">
    import { nanoid } from "nanoid";
    import defaultSquares from "./data/default-squares.json";
    import { randomValue, shuffledArray } from "./utils";

    type Mark = {
        opacity: number;
        size: string;
        top: string;
        left: string;
    };

    type Square = {
        id: string;
        name: string;
        marked: boolean;
        marks: Mark[];
    };

    const generateMarks = () => {
        let marks: Mark[] = [];
        for (let i = 0; i < randomValue(4, 7); i++) {
            marks.push({
                opacity: randomValue(0.2, 0.4),
                size: randomValue(65, 80) + "%",
                top: randomValue(5, 20) + "%",
                left: randomValue(5, 20) + "%",
            });
        }
        return marks;
    };

    const markSquare = (square: Square) => {
        square.marked = !square.marked;
        let duplicateMarkIndex = 0;
        game = game.map((sq) => {
            if (sq.name === square.name) {
                if (square.marked && !sq.marked) {
                    duplicateMarkIndex++;
                    setTimeout(() => {
                        sq.marked = square.marked;
                        game = [...game];
                    }, 300 * duplicateMarkIndex);
                } else if (!square.marked) {
                    sq.marked = square.marked;
                    setTimeout(() => {
                        sq.marks = generateMarks();
                    }, 0);
                }
            }
            return sq;
        });
    };

    const handleSquareKeys = (e: Event) => {
        return "sup";
    };

    const generateGame = (size: number, squares: string[]): Square[] => {
        squares = [...squares];
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
                return {
                    name: square,
                    marked: false,
                    id: nanoid(),
                    marks: generateMarks(),
                };
            });
    };

    const resetGame = () => {
        game = game.map((square) => {
            square.marked = false;
            return square;
        });
    };

    const shuffleGame = () => {
        game = shuffledArray(game);
    };

    const toggleSettings = (e: Event) => {
        if ((e.target as HTMLElement).closest("menu")) {
            return;
        }
        showSettings = !showSettings;
    };

    const changeSize = (e: Event) => {
        const newSize = parseInt((e.target as HTMLInputElement).value);
        const newGame = generateGame(newSize, squares);
        setTimeout(() => {
            size = newSize;
            game = newGame;
        }, 0);
    };

    let showSettings = false;
    let size = 5;
    let squares = defaultSquares.squares;
    let game = generateGame(size, squares);
</script>

<section
    id="card"
    class="bg-white flex flex-col border-solid border-2 border-black"
>
    {#each Array(size) as _, row}
        <div class="flex h-full">
            {#each game.slice(row * size, (row + 1) * size) as square (square.id)}
                <div
                    on:click={() => markSquare(square)}
                    on:keydown={handleSquareKeys}
                    tabindex="0"
                    role="switch"
                    aria-checked={square.marked}
                    class="w-full h-full relative cursor-pointer flex justify-center items-center border-solid border-2 border-black"
                >
                    <p>{square.name}</p>
                    {#each square.marks as mark}
                        <div
                            class:unmarked={!square.marked}
                            class="bg-red-500 absolute rounded-full transition-opacity duration-200"
                            style="opacity: {mark.opacity}; width: {mark.size}; height: {mark.size}; top: {mark.top}; left: {mark.left}; filter: blur(3px)"
                        />
                    {/each}
                </div>
            {/each}
        </div>
    {/each}
</section>
<button
    id="settings-button"
    on:click={toggleSettings}
    class="absolute w-16 h-16 bg-white rounded-full p-2 border-solid border-2 border-black"
>
    <img src="/settings.svg" alt="Settings icon" />

    {#if showSettings}
        <menu
            class="flex flex-col absolute bottom-16 left-0 bg-white border-solid border-2 border-black rounded py-1"
        >
            <li class="px-1 py-1 border-solid border-b-2 border-black">
                <input
                    value={size}
                    on:change={changeSize}
                    id="size"
                    name="size"
                    type="number"
                    step="1"
                    min="3"
                    max="7"
                    class="pl-5"
                />
            </li>
            <li class="px-1 py-1 border-solid border-b-2 border-black">
                <button on:click={resetGame}> Reset </button>
            </li>
            <li class="px-1 py-1">
                <button on:click={shuffleGame}> Shuffle </button>
            </li>
        </menu>
    {/if}
</button>

<style lang="postcss">
    #card {
        box-shadow: inset 0 0 0 2px black;
        @media (max-aspect-ratio: 1/1) {
            width: 90vw;
            height: 90vw;
        }
        @media (min-aspect-ratio: 1/1) {
            width: 90vh;
            height: 90vh;
        }
    }
    .unmarked {
        opacity: 0 !important;
    }
    #settings-button {
        bottom: 1rem;
        left: 1rem;
    }
</style>
