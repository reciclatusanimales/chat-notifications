import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

import { Row, Col, Button, Image } from "react-bootstrap";

import { useAuthDispatch } from "../context/auth";

const GET_USERS = gql`
	query getUsers {
		getUsers {
			username
			email
			createdAt
			imageUrl
			latestMessage {
				uuid
				from
				to
				content
				createdAt
			}
		}
	}
`;

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			createdAt
			content
		}
	}
`;

export default function Home({ history }) {
	const [selectedUser, setSelectedUser] = useState(null);
	const dispatch = useAuthDispatch();

	let usersMarkup;

	const [
		getMessages,
		{ loading: messagesLoading, data: messagesData },
	] = useLazyQuery(GET_MESSAGES);

	useEffect(() => {
		if (selectedUser) {
			getMessages({ variables: { from: selectedUser } });
		}
	}, [selectedUser]);

	if (messagesData) console.log(messagesData.getMessages);

	const logout = () => {
		dispatch({ type: "LOGOUT" });
		history.push("/login");
	};

	const { loading, data, error } = useQuery(GET_USERS);

	if (!data || loading) {
		usersMarkup = <p>Loading...</p>;
	} else if (data.getUsers.length === 0) {
		usersMarkup = <p>No users yet</p>;
	} else if (data.getUsers.length > 0) {
		usersMarkup = data.getUsers.map((user) => (
			<div
				className="d-flex p-3"
				key={user.username}
				onClick={() => setSelectedUser(user.username)}
			>
				<Image
					src={user.imageUrl}
					roundedCircle
					className="mr-2"
					style={{ width: 50, height: 50, objectFit: "cover" }}
				/>

				<div>
					<p className="text-success">{user.username}</p>
					<p className="font-weight-light">
						{user.latestMessage
							? user.latestMessage.content
							: "You are now connected!"}
					</p>
				</div>
			</div>
		));
	}

	return (
		<>
			<Row className="bg-white justify-content-around mb-1">
				<Link to="/login">
					<Button variant="link">Login</Button>
				</Link>
				<Link to="/register">
					<Button variant="link">Register</Button>
				</Link>
				<Button variant="link" onClick={logout}>
					Logout
				</Button>
			</Row>

			<Row className="bg-white">
				<Col xs={4} className="p-0 bg-secondary">
					{usersMarkup}
				</Col>

				<Col xs={8}>
					{messagesData && messagesData.getMessages.length > 0 ? (
						messagesData.getMessages.map((message) => (
							<p key={message.uuid}>{message.content}</p>
						))
					) : (
						<p>Messages</p>
					)}
				</Col>
			</Row>
		</>
	);
}
