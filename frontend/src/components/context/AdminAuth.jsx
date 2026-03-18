import {createContext} from 'react';
import { useState } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({children}) => {
    const adminInfo = localStorage.getItem("adminInfo");
    const [user,setUser] = useState(adminInfo);

    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("adminInfo");
    }

    return (
        <AdminAuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    )
}