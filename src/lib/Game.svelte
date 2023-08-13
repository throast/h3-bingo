<script lang="ts">
    import { nanoid, random } from "nanoid";
    import defaultSquares from "./data/default-squares.json";

    const randomValue = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    };

    const generateMarks = () => {
        let marks = [];
        for (let i = 0; i < randomValue(3, 5); i++) {
            marks.push({
                opacity: randomValue(0.1, 0.5),
                size: randomValue(5, 6) + "rem",
                top: randomValue(0.5, 1.5) + "rem",
                left: randomValue(0.5, 1.5) + "rem",
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
        game = game.map((sq) => {
            if (sq.name === square.name) {
                sq.marked = square.marked;
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

    let size = 4;
    let loadedSquares = defaultSquares.squares;
    let game = newGame(size, loadedSquares);
</script>

<main class="bg-pink-400 h-screen pt-12 flex justify-center items-center">
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
                        class="relative w-32 h-32 cursor-pointer flex justify-center items-center border-solid border-2 border-black"
                    >
                        <p>{square.name}</p>
                        {#each square.marks as mark}
                            <div
                                class:hidden={!square.marked}
                                class="bg-red-500 absolute rounded-full"
                                style="opacity: {mark.opacity}; width: {mark.size}; height: {mark.size}; top: {mark.top}; left: {mark.left}; filter: blur(3px)"
                            />
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}
    </section>
</main>
