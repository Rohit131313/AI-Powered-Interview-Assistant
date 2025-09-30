import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfoPanel: false,
  userResumePanel: true,
  userChatPanel: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUserInfoPanel(state, action) { state.userInfoPanel = action.payload; },
    setUserResumePanel(state, action) { state.userResumePanel = action.payload; },
    setUserChatPanel(state, action) { state.userChatPanel = action.payload; },
  }
});

export const { setUserInfoPanel, setUserResumePanel, setUserChatPanel } = uiSlice.actions;
export default uiSlice.reducer;
