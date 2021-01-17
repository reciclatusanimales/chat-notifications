import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import { Row, Col, Form, Button } from "react-bootstrap";

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			username: $username
			email: $email
			password: $password
			confirmPassword: $confirmPassword
		) {
			username
			email
			createdAt
		}
	}
`;

const initialUserState = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
};

export default function Register(props) {
	const [userData, setUserData] = useState(initialUserState);
	const [errors, setErrors] = useState({});

	const [registerUser, { loading }] = useMutation(REGISTER_USER, {
		update: (_, __) => props.history.push("/login"),
		onError: (error) => setErrors(error.graphQLErrors[0].extensions.errors),
	});

	const handleChange = (event) => {
		setUserData({
			...userData,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		registerUser({ variables: userData });
	};

	return (
		<Row className="bg-white py-5 justify-content-center">
			<Col sm={8} md={6} lg={4}>
				<h1 className="text-center">Register</h1>

				<Form onSubmit={handleSubmit} noValidate>
					<Form.Group>
						<Form.Label className={errors.email && "text-danger"}>
							{errors.email ?? "Email"}
						</Form.Label>
						<Form.Control
							type="email"
							name="email"
							className={errors.email && "is-invalid"}
							value={userData.email}
							onChange={handleChange}
						/>
					</Form.Group>

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

					<Form.Group>
						<Form.Label
							className={errors.confirmPassword && "text-danger"}
						>
							{errors.confirmPassword ?? "Confirm Password"}
						</Form.Label>
						<Form.Control
							type="password"
							name="confirmPassword"
							className={errors.confirmPassword && "is-invalid"}
							value={userData.confirmPassword}
							onChange={handleChange}
						/>
					</Form.Group>

					<div className="text-center">
						<Button
							variant="success"
							type="submit"
							disabled={loading}
						>
							{loading ? "loading..." : "Register"}
						</Button>

						<br />

						<small>
							Already have an account?{" "}
							<Link to="/login">Login</Link>
						</small>
					</div>
				</Form>
			</Col>
		</Row>
	);
}
