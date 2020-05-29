import React from 'react'

const initialValue = {
    handleChangeRepositoryId: (repositoryId) =>{},
    handleDisplaySubMenu: (isDisplayDashBoard) =>{}
}
const MainLayoutContex = React.createContext(initialValue);

export const MainLayoutContexProvider = MainLayoutContex.Provider
export const MainLayoutContexConsumer = MainLayoutContex.Consumer

export default MainLayoutContex