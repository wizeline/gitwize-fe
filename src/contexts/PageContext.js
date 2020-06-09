import React, { useReducer } from 'react'

const today = new Date()
const last7Days = new Date(today.getTime() - (6 * 24 * 60 * 60 * 1000))

const PageContext = React.createContext()

const initialState = {
  dateRange: {
    date_from: last7Days,
    date_to: today
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'changeDate':
      return {
        ...state,
        dateRange: action.newDate
      };
      
    default:
      return state;
  }
};

export const PageProvider = ({children}) =>(
  <PageContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </PageContext.Provider>
);


export const PageConsumer = PageContext.Consumer

export default PageContext
