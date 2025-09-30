import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    phone: '',
    visible: { name: true, email: true, phone: true },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName(state, action) { state.name = action.payload; },
        setEmail(state, action) { state.email = action.payload; },
        setPhone(state, action) { state.phone = action.payload; },
        setVisibleField(state, action) {
            const { field, value } = action.payload; // {field:'name', value:false}
            state.visible[field] = value;
        },
        setFromParsedData(state, action) {
            const data = action.payload || {};
            if (data.name) {
                state.name = data.name;
                state.visible.name = false;
            }
            if (data.email) {
                state.email = data.email;
                state.visible.email = false;
            }
            if (data.phone) {
                state.phone = data.phone;
                state.visible.phone = false;
            }
        },
        resetUser(state) {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.visible = { name: true, email: true, phone: true };
        },
    },
});

export const { setName, setEmail, setPhone, setVisibleField, setFromParsedData, resetUser } = userSlice.actions;
export default userSlice.reducer;
