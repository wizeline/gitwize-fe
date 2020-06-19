import React from 'react'

const initialValue = {
  repositoryId: '',
  showNavbar: true,
  handleChangeRepositoryId: () => {},
  handleShowNavbar: () => {}
}
const MainLayoutContex = React.createContext(initialValue)

export const MainLayoutContexProvider = MainLayoutContex.Provider
export const MainLayoutContexConsumer = MainLayoutContex.Consumer

export default MainLayoutContex
