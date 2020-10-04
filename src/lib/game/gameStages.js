export const GameStageMessages = Object.freeze({
    // players see the word, and submit their clue
    SUBMIT_WORD_REQUEST: 'submit-word-request',
    SUBMIT_WORD_RESPONSE: 'submit-word-response',
    // we remove any duplicate words
    COLLATE_PLAYER_WORDS: 'collate-player-words',
    // turn player sees all the player clues and submits their guess
    PLAYER_GUESS_REQUEST: 'player-guess-request',
    PLAYER_GUESS_RESPONSE: 'player-guess-response',
    // all players see the result
    SHOW_RESULT: 'show-result'
})
