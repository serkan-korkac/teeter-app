const state = {
  isPlaying: false,
  totalWeight: 0,
  currentBoxWeight: null,
  maxWeight: null,
  loosePoint: 20,
  left_forces: [],
  right_forces: [],
  rightCount: ['i'],
  angle: 0,
  totalForce_left: 0,
  totalForce_right: 0
}

const getters = {
  isPlaying(state) {
    return state.isPlaying
  },
  getBoardAngle(state) {
    return `transform: rotate(${state.angle}deg);`
  },
  isLoose(state) {
    const condition = state.angle <= -state.loosePoint || state.angle >= state.loosePoint
    return condition
  },
  getLeftForce(state) {
    return state.totalForce_left
  },
  getRightForce(state) {
    return state.totalForce_right
  },
  getRightCount(state) {
    return state.rightCount
  }
}

const mutations = {
  increaseTotalWeight(state, value) {
    state.totalWeight = state.totalWeight + value
    console.log(state.totalWeight)
  },
  setBoxWeight(state, value) {
    state.currentBoxWeight = value
  },
  newLeftForce(state, value) {
    state.left_forces.push(value)
  },
  newRightForce(state, value) {
    state.right_forces.push(value)
  },
  setAngle(state, value) {
    isFinite(value) ? state.angle = value : 0
    console.log('setangle', state.angle)
  },
  setInfoForce(state, {name, value}) {
    if (name === 'left') state.totalForce_left = value
    if (name === 'right') state.totalForce_right = value
  },
  createRight(state) {
    state.rightCount.push('i')
  }
}

const actions = {
  // F1* d1 = F2 * d2

  calcLeftForce({state, commit}, {m1, d1}) {
    const F1 = m1 * 9.8
    commit('newLeftForce', parseInt(F1 * d1))

    const leftF = state.left_forces.reduce((acc, curr) => {
      return acc + curr
    }, 0)
    commit('setInfoForce', {name: 'left', value: leftF})
  },
  calcRightForce({state, commit}, {m2, d2}) {
    const F2 = m2 * 9.8
    commit('newRightForce', parseInt(F2 * d2))

    const rightF = state.right_forces.reduce((acc, curr) => {
      return acc + curr
    }, 0)
    commit('setInfoForce', {name: 'right', value: rightF})
  },
  calcTotalK({state, commit}) {
    const left = state.totalForce_left
    const right = state.totalForce_right
    const k = left > right ? -(left / right) : right / left
    console.log('k ', k * 4)
    commit('setAngle', k * 4)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}