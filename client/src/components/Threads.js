import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";

import { useDispatch, useSelector } from "react-redux";
import {
	setNewThread,
	setSelectedThread,
	setThreads,
} from "../features/chat/chatSlice";

const GET_THREADS = gql`
	query getThreads {
		getThreads {
			id
			createdAt
			lastMessage
			updatedAt
			unread
			user {
				username
				email
				imageUrl
			}
		}
	}
`;

export default function Threads() {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [timer, setTimer] = useState(null);

	const threads = useSelector((state) => state.chat.threads);
	const selectedThread = useSelector((state) => state.chat.selectedThread);

	const dispatch = useDispatch();

	useEffect(() => {
		if (search.trim() === "") {
			setUsers([]);
			return;
		}
		searchUsers();
	}, [search]);

	const searchUsers = () => {};

	const addThread = (user) => {
		const exists = threads.find(
			(thread) => thread.user.username === user.username
		);

		if (exists) dispatch(setSelectedThread(exists));
		else dispatch(setNewThread(user));

		setSearch("");
	};

	const { loading } = useQuery(GET_THREADS, {
		onCompleted: (data) => dispatch(setThreads(data.getThreads)),
		onError: (error) => console.error(error),
	});

	const handleClickThread = (thread) => {
		dispatch(setSelectedThread(thread));
	};

	let threadsMarkup;
	if (!threads || loading) {
		threadsMarkup = <p>Cargando...</p>;
	} else if (threads.length === 0) {
		threadsMarkup = <p>No has iniciado ninguna conversación.</p>;
	} else if (threads.length > 0) {
		threadsMarkup = threads.map((thread) => {
			const selected = selectedThread?.id === thread.id;
			return (
				<div
					className={classNames(
						"flex flex-row user-div justify-content-center justify-content-md-start p-3 cursor-pointer rounded-md",
						{
							"bg-dark-8": selected,
						}
					)}
					key={thread.user.username}
					onClick={() => handleClickThread(thread)}
				>
					<img
						alt="Profile"
						src={thread.user.imageUrl}
						className="relative inline object-cover w-10 h-10 border-2 border-white rounded-full cursor-pointer user-image profile-image"
					/>
					<div className="ml-2 text-sm font-semibold">
						<p>⊚{thread.user.username}</p>
						<p
							className={classNames("font-extralight", {
								"font-semibold italic": thread.unread > 0,
							})}
						>
							{thread.lastMessage}
						</p>
					</div>
					{thread.unread > 0 && (
						<div className="flex items-center justify-center w-5 h-5 ml-auto text-xs leading-none text-white rounded-full bg-primary-4">
							{thread.unread}
						</div>
					)}
				</div>
			);
		});
	}

	return (
		<div className="flex flex-col mt-8">
			<div className="items-center justify-between text-xs">
				<p className="font-medium">Conversaciones</p>

				<div className="max-w-full px-2 my-6 sm-px-4 w-60 sm:w-100">
					<div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
						<i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
						<input
							type="text"
							className="w-full py-1 pr-3 bg-transparent rounded focus:outline-none"
							placeholder="Buscar"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div
							className="absolute left-0 right-0 z-10 overflow-y-scroll bg-white max-h-52"
							style={{ top: "100%" }}
						>
							{users?.map((user) => (
								<div
									key={user.username}
									className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
									onClick={() => addThread(user)}
								>
									<img
										src={user.imageUrl}
										className="rounded-full"
										alt="User"
										height={(8 * 16) / 4}
										width={(8 * 16) / 4}
									/>
									<div className="ml-4 text-sm">
										<p className="font-medium">
											⊚{user.username}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col mx-1 mt-4 space-y-1 overflow-y-auto">
				{threadsMarkup}
			</div>
		</div>
	);
}
