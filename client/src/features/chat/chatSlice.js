import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	threads: [],
	selectedThread: null,
	newThread: null,
	messages: [],
};

let usersCopy, userIndex, newState, threadCopy;

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setThreads: (state, { payload }) => {
			state.threads = payload;
		},
		setSelectedThread: (state, { payload }) => {
			state.selectedThread = payload;
			state.newThread = null;
		},
		setNewThread: (state, { payload }) => {
			state.newThread = payload;
			state.selectedThread = null;
		},
		setMessages: (state, { payload }) => {
			userIndex = state.threads.findIndex(
				(thread) => thread.id === payload.threadId
			);
			state.threads[userIndex].messages = payload.messages;
			state.threads[userIndex].unread = 0;
			state.messages = payload.messages;
		},
		addMessage: (state, { payload }) => {
			userIndex = state.threads.findIndex(
				(thread) => thread.id === payload.message.threadId
			);

			if (userIndex > -1) {
				state.threads[userIndex].lastMessage = payload.message.content;
				if (
					state.selectedThread &&
					state.selectedThread.id === payload.message.threadId
				) {
					state.selectedThread.lastMessage = payload.message.content;
					state.messages = [payload.message, ...state.messages];
				} else {
					state.threads[userIndex].unread++;
				}

				// Resorting threads
				threadCopy = state.threads[userIndex];
				state.threads.splice(userIndex, 1);
				state.threads = [threadCopy, ...state.threads];
			} else {
				let thread = {
					...payload.message.threadd,
					lastMessage: payload.message.content,
				};
				if (payload.user.username === payload.message.from) {
					// If the new message is mine
					thread.user = {
						username: state.newThread.username,
						imageUrl: state.newThread.imageUrl,
						email: state.newThread.email,
					};
					state.selectedThread = thread;
					state.messages = [payload.message, ...state.messages];
					state.newThread = null;
				} else {
					thread.user = payload.message.user;
					thread.unread = 1;
				}
				state.threads = [thread, ...state.threads];
			}
		},
	},
});

export const {
	setThreads,
	setSelectedThread,
	setNewThread,
	setMessages,
	addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
