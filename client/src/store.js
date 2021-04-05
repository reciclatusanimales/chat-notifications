import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./features/chat/chatSlice.js";
import userSlice from "./features/user/userSlice.js";

export default configureStore({
	reducer: {
		user: userSlice,
		chat: chatSlice,
	},
});
