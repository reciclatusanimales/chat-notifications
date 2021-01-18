import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Col, Image } from "react-bootstrap";
import classNames from "classnames";

import { useMessageDispatch, useMessageState } from "../context/message";

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

export default function Users() {
	let usersMarkup;
	const dispatch = useMessageDispatch();
	const { users } = useMessageState();
	const selectedUser = users?.find((u) => !!u.selected)?.username;

	const { loading } = useQuery(GET_USERS, {
		onCompleted: (data) =>
			dispatch({ type: "SET_USERS", payload: data.getUsers }),
		onError: (error) => console.error(error),
	});

	const handleClickUser = (username) => {
		console.log(username);
		dispatch({ type: "SET_SELECTED_USER", payload: username });
	};

	if (!users || loading) {
		usersMarkup = <p>Loading...</p>;
	} else if (users.length === 0) {
		usersMarkup = <p>No users yet</p>;
	} else if (users.length > 0) {
		usersMarkup = users.map((user) => {
			const selected = selectedUser === user.username;

			return (
				<div
					role="button"
					className={classNames(
						"user-div d-flex justify-content-center justify-content-md-start p-3",
						{
							"bg-white": selected,
						}
					)}
					key={user.username}
					onClick={() => handleClickUser(user.username)}
				>
					<Image
						src={
							user.imageUrl ||
							"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
						}
						className="user-image"
					/>

					<div className="d-none d-md-block ml-2">
						<p className="text-success">{user.username}</p>
						<p className="font-weight-light">
							{user.latestMessage
								? user.latestMessage.content
								: "You are now connected!"}
						</p>
					</div>
				</div>
			);
		});
	}

	return (
		<Col xs={2} md={4} className="p-0 bg-secondary">
			{usersMarkup}
		</Col>
	);
}
