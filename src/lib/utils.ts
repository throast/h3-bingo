
export const randomValue = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export const shuffledArray = <T>(array: T[]): T[] => {
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

export const swapArrayItems = <T>(array: T[], indexA: number, indexB: number): T[] => {
    const newArray = [...array];
    const temp = newArray[indexA];
    newArray[indexA] = newArray[indexB];
    newArray[indexB] = temp;
    return newArray
}
