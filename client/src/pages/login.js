import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

import { Row, Col, Form, Button } from "react-bootstrap";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
	query login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			username
			email
			createdAt
			token
		}
	}
`;

const initialUserState = {
	username: "",
	password: "",
};

export default function Login(props) {
	const [userData, setUserData] = useState(initialUserState);
	const [errors, setErrors] = useState({});

	const dispatch = useAuthDispatch();

	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: (error) => setErrors(error.graphQLErrors[0].extensions.errors),
		onCompleted(data) {
			dispatch({ type: "LOGIN", payload: data.login });
			window.location.href = "/";
		},
	});

	const handleChange = (event) => {
		setUserData({
			...userData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		loginUser({ variables: userData });
	};

	return (
		<Row className="bg-white py-5 justify-content-center">
			<Col sm={8} md={6} lg={4}>
				<h1 className="text-center">Login</h1>

				<Form onSubmit={handleSubmit} noValidate>
					<Form.Group>
						<Form.Label
							className={errors.username && "text-danger"}
						>
							{errors.username ?? "Username"}
						</Form.Label>
						<Form.Control
							type="text"
							name="username"
							className={errors.username && "is-invalid"}
							value={userData.username}
							onChange={handleChange}
						/>
					</Form.Group>

					<Form.Group>
						<Form.Label
							className={errors.password && "text-danger"}
						>
							{errors.password ?? "Password"}
						</Form.Label>
						<Form.Control
							type="password"
							name="password"
							className={errors.password && "is-invalid"}
							value={userData.password}
							onChange={handleChange}
						/>
					</Form.Group>

					<div className="text-center">
						<span className="text-danger">{errors.general}</span>

						<br />

						<Button
							variant="success"
							type="submit"
							disabled={loading}
						>
							{loading ? "loading..." : "Login"}
						</Button>

						<br />

						<small>
							Don't have an account?{" "}
							<Link to="/register">Register</Link>
						</small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
