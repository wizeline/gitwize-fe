import React from 'react'

const initialValue = {
  repositoryId: '',
  handleChangeRepositoryId: () => {}
}
const MainLayoutContex = React.createContext(initialValue)

export const MainLayoutContexProvider = MainLayoutContex.Provider
export const MainLayoutContexConsumer = MainLayoutContex.Consumer

export default MainLayoutContex
