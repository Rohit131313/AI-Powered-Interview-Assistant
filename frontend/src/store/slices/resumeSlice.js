import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setFromParsedData } from './userSlice';
import { setUserInfoPanel, setUserResumePanel, setUserChatPanel } from './uiSlice';


const initialState = {
    loading: '',
    interviewQuestions: null
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setLoading(state, action) { state.loading = action.payload; },
        setInterviewQuestions(state, action) { state.interviewQuestions = action.payload; },
        clearResume(state) {
            state.loading = '';
            state.interviewQuestions = null;
        },
    }
});

export const { setLoading, setInterviewQuestions, clearResume } = resumeSlice.actions;

/**
 * Thunk to upload resume. Called from component.
 */
export const uploadResume = (file) => async (dispatch, getState) => {

    dispatch(setLoading('Uploading file...'));
    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, formData, {
            onUploadProgress: () => {
                dispatch(setLoading('Uploading...'));
            },
        });

        dispatch(setLoading('Processing resume...'));
        // simulate backend streaming steps (matching your earlier code)
        await new Promise(r => setTimeout(r, 500));
        dispatch(setLoading('Extracting text...'));
        await new Promise(r => setTimeout(r, 500));



        const { data } = response;
        const parsed = data.data ;

        // update user slice with parsed fields (name/email/phone) and visibility
        dispatch(setFromParsedData(parsed));

        

        


        try {
            await dispatch(addUserInfo(parsed.name, parsed.email, parsed.phone));
            // console.log("User info saved in MongoDB");
        } catch (err) {
            console.error("Failed to save user info:", err.message);
            throw err;
        }

        const questions = data.interviewQuestions.questions || [];
        // console.log("Questions in thunk:", questions);
        dispatch(setInterviewQuestions(questions));
        // console.log(getState().resume.interviewQuestions)

        

        dispatch(setLoading('Done'));

        const { visible } = getState().user;
        // Update UI panels
        dispatch(setUserResumePanel(false));

        if (visible.name || visible.email || visible.phone) {
            dispatch(setUserInfoPanel(true));
        } else {
            dispatch(setUserChatPanel(true));
        }

        return response;
    } catch (err) {
        dispatch(setLoading(''));
        throw err.response?.data?.error || err.message  ||err||"Upload failed";
    }
};


export const addUserInfo = (name, email, phone) => async (dispatch) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/addinfo`, {
            name,
            email,
            phone
        });


        const { user, message } = response.data;

        return user;
    } catch (err) {
        console.error("Add user info error:", err);
        
        const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to save user info";
        
        throw errorMessage;
    }
};


export default resumeSlice.reducer;
