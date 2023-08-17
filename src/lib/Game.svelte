<script lang="ts">
    import { nanoid } from "nanoid";
    import { randomValue, shuffledArray, swapArrayItems } from "./utils";
    import defaultSquares from "./data/default-squares.json";
    // import settingsIcon from "../assets/settings.svg";

    // console.log(settingsIcon);

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
                opacity: randomValue(0.1, 0.3),
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

<h3
    id="bingo-msg"
    class:no-bingo={!showBingo}
    class:bingo={bingoAnimating}
    class="text-6xl mb-6 z-30 transition-all duration-600 linear"
>
    {bingoMessage}
</h3>
<section
    id="card"
    class:ultimate={ultimateBingoAnimating}
    style="background-color: var(--card); border-color: var(--border);"
    class="flex flex-col border-solid border-2"
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
                    style="border-color: var(--border);"
                    class="w-full h-full relative cursor-pointer flex flex-1 justify-center items-center text-center text-sm sm:text-base border-solid border-2 sm:px-2"
                >
                    <p class="absolute">{square.name}</p>
                    {#each square.marks as mark}
                        <div
                            class:unmarked={!square.marked}
                            class="absolute rounded-full transition-opacity duration-200"
                            style="background-color: var(--mark); opacity: {mark.opacity}; width: {mark.size}; height: {mark.size}; top: {mark.top}; left: {mark.left}; filter: blur(3px)"
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
    style="border-color: var(--border); background-color: var(--main);"
    class="absolute w-16 h-16 bg-white rounded-full p-2 border-solid border-2"
>
    <svg
        width="100%"
        height="100%"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 54 54"
        xml:space="preserve"
    >
        <g>
            <path
                style="fill: var(--border);"
                d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571
		c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571
		c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78
		C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571
		c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571
		c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052
		c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966
		c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42
		c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052
		c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553
		c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114
		S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22
		C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571
		c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854
		c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052
		c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572
		c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294
		C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052
		c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553
		c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78
		C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64
		c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104
		l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"
            />
            <path
                style="fill: var(--border);"
                d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7
		s7,3.141,7,7S30.859,34,27,34z"
            />
        </g>
    </svg>

    {#if showSettings}
        <menu
            style="background-color: var(--card);"
            class="flex flex-col absolute bottom-16 left-0 border-solid border-2 border-black rounded py-1"
        >
            <li class="px-1 py-1 border-solid border-b-2 border-black">
                <input
                    class="pl-2"
                    value={size}
                    on:change={changeSize}
                    id="size"
                    name="size"
                    type="number"
                    step="1"
                    min="3"
                    max="7"
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
