import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  input: '',
  interviewIndex: -1,
  timer: 0,
  isPaused: false

};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) { state.messages.push(action.payload); }, // {type:'user'|'system', text: string}
    setInput(state, action) { state.input = action.payload; },
    setInterviewIndex(state, action) { state.interviewIndex = action.payload; },
    setTimer(state, action) { state.timer = action.payload; },
    setPaused: (state, action) => { state.isPaused = action.payload; },
    clearMessages(state) { state.messages = []; },
  }
});

export const { addMessage, setInput,setInterviewIndex,setTimer,setPaused, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
