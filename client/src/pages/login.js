import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import InputGroup from "../components/InputGroup";
import { login } from "../features/user/userSlice";

const LOGIN_USER = gql`
	query login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			username
			email
			imageUrl
			createdAt
			token
		}
	}
`;

export default function Login({ history }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();

	const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
		onError: (error) => setErrors(error.graphQLErrors[0].extensions.errors),
		onCompleted(data) {
			dispatch(login(data.login));
			history.push("/");
		},
	});

	const handleSubmit = (event) => {
		event.preventDefault();

		loginUser({ variables: { username, password } });
	};

	return (
		<div className="flex bg-primary-5">
			<div
				className="w-1/3 h-screen bg-right bg-cover"
				style={{ backgroundImage: "url('/images/clics.jpg')" }}
			></div>

			<div className="flex flex-col justify-center pl-6 pr-2">
				<div className="xs:w-50 sm:w-70">
					<h1 className="mb-2 text-lg font-medium">Entrar</h1>

					<form onSubmit={handleSubmit} noValidate>
						<InputGroup
							className="mb-2"
							type="text"
							value={username}
							setValue={setUsername}
							placeholder="Nombre de usuario"
							error={errors.username}
						/>

						<InputGroup
							className="mb-4"
							type="password"
							value={password}
							setValue={setPassword}
							placeholder="Contraseña"
							error={errors.password}
						/>

						<small className="font-medium text-primary-4">
							{errors.general}
						</small>

						<button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase border rounded border-primary-1 bg-primary-1">
							Entrar
						</button>
					</form>

					<small>
						¿Eres nuevo en Clics?
						<Link
							to="/register"
							className="ml-1 font-bold uppercase text-primary-1"
						>
							Regístrate
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
