import { useState, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    function login(user, token){
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token)
    }
    
    function logout(){
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }
    return(
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export {AuthProvider, AuthContext}