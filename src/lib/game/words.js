export const gameWords = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6']

export function getRandomWord(pastWords) {
    const newWord = gameWords[Math.floor(Math.random() * gameWords.length)]
    if (pastWords.contains(newWord)) {
        return getRandomWord(pastWords)
    }
    return newWord
}
