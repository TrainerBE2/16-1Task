import React, { ReactNode } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { tokenKey } from "../constants/common";
import { Cookies } from "react-cookie";

interface Props {
    children: ReactNode;
}

async function getToken() {
    const cookies = new Cookies();
    return await cookies.get(tokenKey);
}

const PublicRoute = ({ children, ...rest }: Props & RouteProps) => {
    const { isAuthenticated } = useAuth();
    const token = getToken();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated && !!token ? (
                    <Redirect
                        to={{
                            pathname: "/home",
                            state: { from: location },
                        }}
                    />
                ) : (
                    children
                )
            }
        />
    );
};

export default PublicRoute;
