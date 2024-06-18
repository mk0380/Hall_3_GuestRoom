
import { createContext, useState } from "react"

export const LoggedInUser = createContext();

const UserContext = ({children}) => {


    const [admin, setAdmin] = useState(undefined)

  return (
    <LoggedInUser.Provider value={{ admin, setAdmin}}>
        {children}
    </LoggedInUser.Provider>
  )
}

export default UserContext