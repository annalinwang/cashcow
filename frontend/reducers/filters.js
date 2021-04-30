import { Filters } from '../actions'

const { SHOW_ALL } = Filters

const filter = (state = SHOW_ALL, action) => {
  const { type, filter } = action
  switch (type) {
    case 'SET_FILTER':
      return filter
    default:
      return state
  }
}

export default filter
