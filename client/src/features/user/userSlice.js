import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
	user: null,
	loading: false,
	error: false,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, { payload }) => {
			localStorage.setItem("token", payload.token);
			state.user = payload;
			state.loading = false;
			state.error = false;
		},
		logout: (state) => {
			localStorage.removeItem("token");
			state.user = null;
		},
	},
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
