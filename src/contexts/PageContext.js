import React, { useReducer } from 'react'

const defaultValue = {
  handleChangeRepositoryId: (repositoryId) => {},
  handleDisplaySubMenu: (isDisplayDashBoard) => {},
  handleChangeRepositoryName: (repositoryName) => {}
}
const PageContext = React.createContext(defaultValue)

const initialState = {
  dateRange: {
    date_from: undefined,
    date_to: undefined
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
