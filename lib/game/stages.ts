import JoinStage from '../../components/JoinStage/JoinStage'
import PlaceholderRenderer from '../../components/PlaceholderRenderer'
import SubmitWordStage from '../../components/SubmitWordStage/SubmitWordStage'

export const GameStageIds = Object.freeze({
  JOIN: 'join',
  GAME_START: 'game-start',
  SUBMIT_WORD: 'submit-word',
  COMPARE_WORDS: 'compare-words',
  PLAYER_GUESS: 'player-guess',
  END_TURN: 'end-turn',
  END: 'end',
})

export const GameStages = Object.freeze({
  [GameStageIds.JOIN]: {
    nextStage: GameStageIds.GAME_START,
    Renderer: JoinStage,
  },
  [GameStageIds.SUBMIT_WORD]: {
    nextStage: GameStageIds.COMPARE_WORDS,
    Renderer: SubmitWordStage,
  },
  [GameStageIds.COMPARE_WORDS]: {
    nextStage: GameStageIds.PLAYER_GUESS,
    Renderer: PlaceholderRenderer,
  },
  [GameStageIds.PLAYER_GUESS]: {
    nextStage: GameStageIds.END_TURN,
    Renderer: PlaceholderRenderer,
  },
  [GameStageIds.END_TURN]: {
    nextStage: GameStageIds.SUBMIT_WORD,
    Renderer: PlaceholderRenderer,
  },
})
