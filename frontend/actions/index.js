export const setFilter = filter => ({
    type: 'SET_FILTER',
    filter,
  })
  
export const Filters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_INCOMPLETE: 'SHOW_INCOMPLETE',
    SHOW_SENT: 'SHOW_SENT',
}
  