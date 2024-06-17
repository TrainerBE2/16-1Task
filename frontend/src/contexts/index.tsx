import React, { ReactNode, useEffect } from "react";
import { AuthProvider } from "./authContext";
import { ModalProvider } from "./modalContext";

interface IindexProps {
    children: ReactNode;
}

const AppProvider = ({ children }: IindexProps) => {
    useEffect(() => {
        document.title = 'Task Management';
    }, []);
    return (
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    );
};

export default AppProvider;
