import React, { useState } from "react";

import { useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

const REACT_TO_MESSAGE = gql`
	mutation reactToMessage($uuid: String!, $content: String!) {
		reactToMessage(uuid: $uuid, content: $content) {
			uuid
		}
	}
`;

export default function Message({ message }) {
	const user = useSelector((state) => state.user.user);
	const sent = message.from === user.username;
	const received = !sent;
	const [showPopover, setShowPopover] = useState(false);
	//const reactionIcons = [...new Set(message.reactions.map((r) => r.content))];

	const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
		onCompleted: (data) => {
			setShowPopover(false);
		},
		onError: (error) => console.error(error),
	});

	const handleReact = (reaction) => {
		reactToMessage({
			variables: { uuid: message.uuid, content: reaction },
		});
	};

	const reactionButton = null;

	return sent ? (
		<div className="col-start-1 col-end-8 p-3 rounded-lg">
			<div className="flex flex-row items-center">
				<img
					src={message.user.imageUrl}
					className="rounded-full"
					alt="User"
					height={(8 * 16) / 4}
					width={(8 * 16) / 4}
				/>
				<div className="relative px-4 py-2 ml-3 text-sm bg-white shadow rounded-xl">
					<div>{message.content}</div>
				</div>
			</div>
		</div>
	) : (
		<div className="col-start-6 col-end-13 p-3 rounded-lg">
			<div className="flex flex-row-reverse items-center justify-start">
				<img
					src={message.user.imageUrl}
					className="rounded-full"
					alt="User"
					height={(8 * 16) / 4}
					width={(8 * 16) / 4}
				/>
				<div className="relative px-4 py-2 mr-3 text-sm bg-indigo-100 shadow rounded-xl">
					<div>{message.content}</div>
				</div>
			</div>
		</div>
	);
}
