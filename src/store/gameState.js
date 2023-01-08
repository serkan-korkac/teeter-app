const state = {
  isPlaying: false
}

const getters = {
  isPlaying(state) {
    return state.isPlaying
  }
}

const mutations = {
  SET_PLAY(state, value) {
    state.isPlaying = value
    console.log('play: ', state.isPlaying)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}