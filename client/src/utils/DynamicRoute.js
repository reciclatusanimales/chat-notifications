import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export default function DynamicRoute({
	guest,
	authenticated,
	component,
	...props
}) {
	const user = useSelector((state) => state.user.user);
	if (authenticated && !user) return <Redirect to="/login" />;
	else if (guest && user) return <Redirect to="/" />;
	else return <Route component={component} {...props} />;
}
