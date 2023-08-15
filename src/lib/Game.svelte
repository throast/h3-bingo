<script lang="ts">
    import { nanoid } from "nanoid";
    import defaultSquares from "./data/default-squares.json";
    import { randomValue, shuffledArray, swapArrayItems } from "./utils";

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
        for (let i = 0; i < randomValue(4, 6); i++) {
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
        if (square.name === "FREE") {
            return;
        }
        square.marked = !square.marked;
        bingoCheck();
        let duplicateMarkIndex = 0;
        game = game.map((sq) => {
            if (sq.name === square.name) {
                if (square.marked && !sq.marked) {
                    duplicateMarkIndex++;
                    setTimeout(() => {
                        sq.marked = square.marked;
                        game = [...game];
                        bingoCheck();
                    }, 300 * duplicateMarkIndex);
                } else if (!square.marked) {
                    sq.marked = square.marked;
                    bingoCheck();
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
        let newGame = shuffledArray(squares)
            .slice(0, size ** 2)
            .map((square) => {
                return {
                    name: square,
                    marked: false,
                    id: nanoid(),
                    marks: generateMarks(),
                };
            });
        if (newGame.length % 2 !== 0) {
            newGame[(newGame.length - 1) / 2] = {
                name: "FREE",
                marked: true,
                id: nanoid(),
                marks: generateMarks(),
            };
        }
        return newGame;
    };

    const resetGame = () => {
        game = game.map((square) => {
            if (square.name !== "FREE") {
                square.marked = false;
            }
            return square;
        });
        bingoCheck();
    };

    const shuffleGame = () => {
        if (game.length % 2 === 0) {
            game = shuffledArray(game);
        } else {
            const shuffledGame = shuffledArray(game);
            game = swapArrayItems(
                shuffledGame,
                (shuffledGame.length - 1) / 2,
                shuffledGame.findIndex((square) => square.name === "FREE")
            );
        }
        bingoCheck();
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
            bingoCheck();
        }, 0);
    };

    const isRowFilled = (rowIndex: number) => {
        for (let colIndex = 0; colIndex < size; colIndex++) {
            if (!game[rowIndex * size + colIndex].marked) {
                return false;
            }
        }
        return true;
    };

    const isColFilled = (colIndex: number) => {
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            if (!game[rowIndex * size + colIndex].marked) {
                return false;
            }
        }
        return true;
    };

    const bingoCheck = () => {
        let bingos = 0;
        for (let i = 0; i < size; i++) {
            if (isRowFilled(i)) {
                bingos++;
            }
            if (isColFilled(i)) {
                bingos++;
            }
        }
        bingoCount = bingos;
        if (bingoCount === 0) {
            showBingo = false;
            prevBingoCount = 0;
            setTimeout(() => {
                bingoMessage = "no bingos here...";
            }, 300);
            return;
        }
        showBingo = true;
        bingoAnimation();
        if (bingoCount === 1) {
            bingoMessage = "Bingo!";
        } else if (bingoCount === size * 2) {
            bingoMessage = "Ultimate Bingo!";
            ultimateBingoAnimation();
        } else if (bingoCount > 1) {
            bingoMessage = `Bingo! x${bingoCount}`;
        }
    };

    const bingoAnimation = () => {
        if (!bingoAnimating && bingoCount !== prevBingoCount) {
            bingoAnimating = true;
            prevBingoCount = bingoCount;
            setTimeout(() => {
                bingoAnimating = false;
            }, 1000);
        }
    };

    const ultimateBingoAnimation = () => {
        if (!ultimateBingoAnimating) {
            ultimateBingoAnimating = true;
            setTimeout(() => {
                ultimateBingoAnimating = false;
            }, 1000);
        }
    };

    let showSettings = false;
    let showBingo = false;
    let bingoAnimating = false;
    let ultimateBingoAnimating = false;
    let size = 5;
    let squares = defaultSquares.squares;
    let game = generateGame(size, squares);
    let bingoCount = 0;
    let prevBingoCount = 0;
    let bingoMessage = "no bingos here...";
</script>

<h2
    id="bingo-msg"
    class:no-bingo={!showBingo}
    class:bingo={bingoAnimating}
    class="text-6xl mb-6 z-30 transition-all duration-600 linear"
>
    {bingoMessage}
</h2>
<section
    id="card"
    class:ultimate={ultimateBingoAnimating}
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
        /* Portrait ratios */
        @media (max-aspect-ratio: 10/12) {
            width: 96vw;
            height: 96vw;
        }
        /* Landscape ratios */
        @media (min-aspect-ratio: 10/12) {
            width: 80vh;
            height: 80vh;
        }
    }
    @keyframes bingo {
        0%,
        100% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.7);
        }
        75% {
            transform: scale(1.4);
        }
    }
    .bingo {
        animation: bingo 1s;
    }
    @keyframes ultimate {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.7);
        }
        75% {
            transform: scale(1.2);
        }
    }
    .ultimate {
        animation: ultimate 1s infinite alternate;
    }
    .unmarked {
        opacity: 0 !important;
    }
    #settings-button {
        bottom: 1rem;
        left: 1rem;
    }
    .no-bingo {
        opacity: 0;
        transform: translateY(-5rem);
    }
</style>
