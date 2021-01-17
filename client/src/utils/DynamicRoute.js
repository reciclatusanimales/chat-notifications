import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthState } from "../context/auth";

export default function DynamicRoute({
	guest,
	authenticated,
	component,
	...props
}) {
	const { user } = useAuthState();

	if (authenticated && !user) return <Redirect to="/login" />;
	else if (guest && user) return <Redirect to="/" />;
	else return <Route component={component} {...props} />;
}
