import { createContext, useState } from 'react'
import { BasicAccount } from '../types/BasicAccount'

const AccountContext = createContext({} as any)

export const AccountProvider = ({ children }: any) => {
    const [account, setAccount] = useState({} as BasicAccount)

    const appendAccount = (newAccountData: any) => {
        setAccount({ ...account, ...newAccountData })
    }

    const refreshAccount = () => {
        setAccount({} as BasicAccount)
    }

    const replaceAccount = (newAccountData: any) => {
        setAccount(newAccountData)
    }

    return (
        <AccountContext.Provider
            value={{ account, appendAccount, refreshAccount, replaceAccount }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export default AccountContext
