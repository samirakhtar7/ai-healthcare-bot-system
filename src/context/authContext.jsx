import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const login = (email, password) => {
		// Simulate login - accept any non-empty credentials
		if (email && password) {
			setUser({ email, name: email.split("@")[0] });
			return true;
		}
		return false;
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};