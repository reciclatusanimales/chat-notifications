import React, { Fragment, useState, useEffect } from "react";

import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { useDispatch, useSelector } from "react-redux";

import Message from "./Message";
import { setMessages } from "../features/chat/chatSlice";

const GET_MESSAGES = gql`
	query getMessages($threadId: Int!) {
		getMessages(threadId: $threadId) {
			uuid
			from
			user {
				username
				imageUrl
			}
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
	mutation sendMessage($threadId: Int, $username: String, $content: String!) {
		sendMessage(
			threadId: $threadId
			username: $username
			content: $content
		) {
			uuid
			from
			content
			createdAt
		}
	}
`;

export default function Messages() {
	const [content, setContent] = useState("");
	const selectedThread = useSelector((state) => state.chat.selectedThread);

	const newThread = useSelector((state) => state.chat.newThread);
	const messages = useSelector((state) => state.chat.messages);

	const dispatch = useDispatch();

	const [
		getMessages,
		{ loading: messagesLoading, data: messagesData },
	] = useLazyQuery(GET_MESSAGES);

	const [sendMessage] = useMutation(SEND_MESSAGE, {
		onError: (error) => console.error(error),
	});

	useEffect(() => {
		if (selectedThread) {
			getMessages({ variables: { threadId: Number(selectedThread.id) } });
		}
		// eslint-disable-next-line
	}, [selectedThread]);

	useEffect(() => {
		if (messagesData) {
			dispatch(
				setMessages({
					threadId: selectedThread.id,
					messages: messagesData.getMessages,
				})
			);
		}
		// eslint-disable-next-line
	}, [messagesData]);

	const handleSubmit = () => {
		if (content.trim() === "" || (!selectedThread && !newThread)) return;

		let variables;

		setContent("");

		if (selectedThread) {
			variables = { threadId: Number(selectedThread.id), content };
		} else if (newThread) {
			variables = { username: newThread.username, content };
		}
		sendMessage({
			variables,
		});
	};

	let messagesMarkup, selectedChatMarkup;

	if (!messages && !messagesLoading) {
		messagesMarkup = <p className="info-text">Select a friend.</p>;
	} else if (messagesLoading) {
		messagesMarkup = <p className="info-text">Loading...</p>;
	} else if (!!messages.length) {
		messagesMarkup = messages.map((message, index) => (
			<Fragment key={message.uuid}>
				<Message message={message} />
				{index === message.length - 1 && (
					<div className="invisible">
						<hr className="m-0" />
					</div>
				)}
			</Fragment>
		));
	}

	if (selectedThread) {
		selectedChatMarkup = (
			<>
				<img
					src={selectedThread.user.imageUrl}
					className="rounded-full"
					alt="User"
					height={48}
					width={48}
				/>
				<div className="ml-4 text-sm">
					<p className="text-lg font-medium">
						⊚{selectedThread.user.username}
					</p>
					<p className="text-xs font-light text-gray-500">
						{selectedThread.user.email}
					</p>
				</div>
			</>
		);
	} else if (newThread) {
		selectedChatMarkup = (
			<>
				<img
					src={newThread.imageUrl}
					className="rounded-full"
					alt="User"
					height={48}
					width={48}
				/>
				<div className="ml-4 text-sm">
					<p className="text-lg font-medium">⊚{newThread.username}</p>
					<p className="text-xs italic font-light text-gray-500">
						{newThread.email}
					</p>
				</div>
			</>
		);
	}

	return (
		<div className="flex flex-col flex-auto h-full px-4">
			<div className="flex flex-col flex-auto flex-shrink-0 h-full bg-gray-100 rounded-2xl">
				{(selectedThread || newThread) && (
					<div className="flex flex-row items-center w-full h-24 bg-white rounded-t-md">
						<div className="flex-grow ml-4">
							<div className="flex items-center px-4 py-3">
								{selectedChatMarkup}
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-col-reverse h-full mb-4 scroll">
					{messagesMarkup}
				</div>

				{(selectedThread || newThread) && (
					<div className="flex flex-row items-center w-full h-20 px-4 bg-white rounded-b-md">
						<div className="flex-grow ml-4">
							<div className="relative w-full">
								<input
									type="text"
									className="flex w-full h-10 pl-4 border rounded-xl focus:outline-none focus:border-indigo-300"
									placeholder="Escribe aquí..."
									name="content"
									value={content}
									onChange={(event) =>
										setContent(event.target.value)
									}
								/>
							</div>
						</div>
						<div className="ml-4">
							<i
								className="mx-2 fas fa-paper-plane fa-2x text-primary"
								onClick={handleSubmit}
								role="button"
							></i>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
