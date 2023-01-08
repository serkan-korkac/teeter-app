
import gameState from './gameState'
import calculations from './calculations'
import { createStore } from 'vuex'

export const store = new createStore({
  modules: {
    gameState,
    calculations
  }
})