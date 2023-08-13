<script lang="ts">
    import { nanoid } from "nanoid";
    import defaultSquares from "./data/default-squares.json";

    const randomValue = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    // size: randomValue(5, 6) + "rem",
    // top: randomValue(0.5, 1.5) + "rem",
    // left: randomValue(0.5, 1.5) + "rem",
    const generateMarks = () => {
        let marks = [];
        for (let i = 0; i < randomValue(3, 5); i++) {
            marks.push({
                opacity: randomValue(0.2, 0.4),
                size: randomValue(65, 80) + "%",
                top: randomValue(5, 15) + "%",
                left: randomValue(5, 15) + "%",
            });
        }
        return marks;
    };

    const markSquare = (square: {
        name: string;
        marked: boolean;
        id: string;
        marks: any[];
    }) => {
        square.marked = !square.marked;
        let duplicateMarkIndex = 0;
        game = game.map((sq, i) => {
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

    let size = 6;
    let loadedSquares = defaultSquares.squares;
    let game = newGame(size, loadedSquares);
</script>

<section class="bg-white flex flex-col border-solid border-2 border-black">
    {#each Array(size) as _, row}
        <div class="flex">
            {#each game.slice(row * size, (row + 1) * size) as square (square.id)}
                <div
                    on:click={() => markSquare(square)}
                    on:keydown={handleSquareKeys}
                    tabindex="0"
                    role="switch"
                    aria-checked={square.marked}
                    class="square relative cursor-pointer flex justify-center items-center border-solid border-2 border-black"
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

<style lang="postcss">
    .square {
        width: 8rem;
        height: 8rem;
        @media screen and (min-width: 768px) and (max-height: 500px) {
            width: 6rem;
            height: 6rem;
        }
    }
    .unmarked {
        opacity: 0 !important;
    }
</style>
