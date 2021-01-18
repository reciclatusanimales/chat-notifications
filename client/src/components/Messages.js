import React, { Fragment, useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";

import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { useMessageDispatch, useMessageState } from "../context/message";

import Message from "./Message";

const GET_MESSAGES = gql`
	query getMessages($from: String!) {
		getMessages(from: $from) {
			uuid
			from
			to
			createdAt
			content
			reactions {
				uuid
				content
			}
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($to: String!, $content: String!) {
		sendMessage(to: $to, content: $content) {
			uuid
			from
			to
			content
			createdAt
		}
	}
`;

export default function Messages() {
	const { users } = useMessageState();
	const [content, setContent] = useState("");
	const selectedUser = users?.find((u) => !!u.selected);
	const dispatch = useMessageDispatch();
	const messages = selectedUser?.messages;

	const [
		getMessages,
		{ loading: messagesLoading, data: messagesData },
	] = useLazyQuery(GET_MESSAGES);

	const [sendMessage] = useMutation(SEND_MESSAGE, {
		onError: (error) => console.error(error),
	});

	useEffect(() => {
		if (selectedUser && !selectedUser.messages) {
			getMessages({ variables: { from: selectedUser.username } });
		}
		// eslint-disable-next-line
	}, [selectedUser]);

	useEffect(() => {
		if (messagesData) {
			dispatch({
				type: "SET_USER_MESSAGES",
				payload: {
					username: selectedUser.username,
					messages: messagesData.getMessages,
				},
			});
		}
		// eslint-disable-next-line
	}, [messagesData]);

	const handleSubmit = (event) => {
		event.preventDefault();

		if (content.trim() === "" || !selectedUser) return;

		setContent("");

		sendMessage({ variables: { to: selectedUser.username, content } });
	};

	let selectedChatMarkup;
	if (!messages && !messagesLoading) {
		selectedChatMarkup = <p className="info-text">Select a friend.</p>;
	} else if (messagesLoading) {
		selectedChatMarkup = <p className="info-text">Loading...</p>;
	} else if (!!messages.length) {
		selectedChatMarkup = messages.map((message, index) => (
			<Fragment key={message.uuid}>
				<Message message={message} />
				{index === message.length - 1 && (
					<div className="invisible">
						<hr className="m-0" />
					</div>
				)}
			</Fragment>
		));
	} else {
		selectedChatMarkup = (
			<p className="info-text">You are now connected!</p>
		);
	}

	return (
		<Col md={8} xs={10} className="p-0">
			<div className="messages-box d-flex flex-column-reverse p-3">
				{selectedChatMarkup}
			</div>
			<div className="px-3 py-2">
				<Form onSubmit={handleSubmit}>
					<Form.Group className="d-flex align-items-center m-0">
						<Form.Control
							type="text"
							name="content"
							className="message-input rounded-pill p-4 bg-secondary border-0"
							placeholder="Type a message..."
							value={content}
							onChange={(event) => setContent(event.target.value)}
						/>
						<i
							className="fas fa-paper-plane fa-2x text-primary ml-2"
							onClick={handleSubmit}
							role="button"
						></i>
					</Form.Group>
				</Form>
			</div>
		</Col>
	);
}
