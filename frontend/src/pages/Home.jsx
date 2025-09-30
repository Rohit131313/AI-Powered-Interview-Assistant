import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNotification } from "../context/NotificationContext";
import { uploadResume } from '../store/slices/resumeSlice';
import { setName, setEmail, setPhone, setVisibleField } from '../store/slices/userSlice';
import { setUserInfoPanel, setUserChatPanel } from '../store/slices/uiSlice';
import { addMessage, setInput, setInterviewIndex, setTimer } from '../store/slices/chatSlice';
import { addUserInfo } from '../store/slices/resumeSlice';
import { useGSAP } from '@gsap/react';
import { store } from '../store/store';
import gsap from 'gsap';
import axios from 'axios';

import UserUploadResume from '../components/UserUploadResume';
import UserInformation from '../components/UserInformation';
import UserInterviewChat from '../components/UserInterviewChat';

const Home = () => {
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    // selectors
    const { name, email, phone, visible } = useSelector(state => state.user);
    const { userInfoPanel, userResumePanel, userChatPanel } = useSelector(state => state.ui);
    const { loading, interviewQuestions } = useSelector(state => state.resume);
    const { messages, input, interviewIndex, timer, isPaused } = useSelector(state => state.chat);

    const [file, setFile] = useState(null);



    // refs for GSAP + scroll
    const userInfoRef = useRef(null);
    const userResumeRef = useRef(null);
    const userChatRef = useRef(null);
    const chatsEndRef = useRef(null);

    // GSAP reacts to redux UI flags
    useGSAP(() => {
        if (userInfoPanel) {
            gsap.to(userInfoRef.current, { transform: 'translateY(0)', bottom: '30%' });
        } else {
            gsap.to(userInfoRef.current, { transform: 'translateY(200%)' });
        }
    }, [userInfoPanel]);

    useGSAP(() => {
        if (userResumePanel) {
            gsap.to(userResumeRef.current, { transform: 'translateY(0)' });
        } else {
            gsap.to(userResumeRef.current, { transform: 'translateY(200%)' });
        }
    }, [userResumePanel]);

    useGSAP(() => {
        if (userChatPanel) {
            gsap.to(userChatRef.current, { transform: 'translateY(0)', bottom: '3%' });
        } else {
            gsap.to(userChatRef.current, { transform: 'translateY(200%)' });
        }
    }, [userChatPanel]);

    // scroll chat on messages update
    useEffect(() => {
        chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ---- handlers ----
    const handleChange = (e) => {
        const picked = e.target.files?.[0] ?? null;
        setFile(picked);
    };


    const submitHandler = async (e) => {
        e?.preventDefault?.();
        if (!file) {
            showNotification("Select a file", "error");
            return;
        }
        try {
            // Call the upload function directly, don't dispatch
            const data = await dispatch(uploadResume(file));
            showNotification("Resume uploaded", "success");

            dispatch(addMessage({ type: 'system', text: "Welcome! This interview consists of 6 questions—2 Easy, 2 Medium, and 2 Hard. Each question has a specific time limit: Easy 20s, Medium 60s, Hard 120s. Please answer each question promptly. You can pause or resume the interview at any time. To start, type anything in the input box and press send—this will begin the first question and start the timer." }));


        } catch (err) {
            console.error(err);
            showNotification(err, "error");
        }
    };



    const validateAndOpenChat = async (e) => {
        e?.preventDefault?.();
        // Validate using values from Redux
        if (!name.trim()) {
            showNotification("Name is required", "error");
            return;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            showNotification("Valid email is required", "error");
            return;
        }
        if (!phone.trim() || !/^\d{10}$/.test(phone)) {
            showNotification("Phone must be 10 digits", "error");
            return;
        }




        // console.log(phone,",",email,",",name);
        try {
            await dispatch(addUserInfo(name, email, phone));
            // set visible fields to false 
            dispatch(setVisibleField({ field: 'name', value: false }));
            dispatch(setVisibleField({ field: 'email', value: false }));
            dispatch(setVisibleField({ field: 'phone', value: false }));
            // close info panel and open chat
            dispatch(setUserInfoPanel(false));
            dispatch(setUserChatPanel(true));
        } catch (err) {
            console.error("Failed to save user info:", err.message);
            showNotification(err || err.message, "error");
        }



    };


    const getDefaultTime = (index) => {
        if (index < 2 && index >= 0) return 20;      // Easy
        else if (index < 4 && index >= 2) return 60; // Medium
        else if (index < 6 && index >= 4) return 120; // Hard
        return 0; // fallback
    };

    const startTimer = (index) => {
        const savedTimers = JSON.parse(localStorage.getItem('questionTimers') || '{}');
        let time = savedTimers[index] ?? getDefaultTime(index);

        if (time <= 0) {
            dispatch(setTimer(0));
            return;
        }

        dispatch(setTimer(time));

        const interval = setInterval(() => {
            const { chat } = store.getState(); // or getState from thunk
            if (chat.isPaused) return;

            let currentTime = chat.timer;

            if (currentTime <= 0) {
                clearInterval(interval);
                handleSend(true, chat.input); // auto-send current input
                return;
            }

            const newTime = currentTime - 1;
            dispatch(setTimer(newTime));

            // persist timer
            const timers = JSON.parse(localStorage.getItem('questionTimers') || '{}');
            timers[index] = newTime;
            localStorage.setItem('questionTimers', JSON.stringify(timers));
        }, 1000);

        return () => clearInterval(interval); // cleanup
    };
    useEffect(() => {
        const cleanup = startTimer(interviewIndex);
        return cleanup;
    }, [interviewIndex]);


    const handleSend = async (auto = false, forcedAnswer = null) => {
        // Only send "No Answer" if there is a question displayed
        let userAnswer = forcedAnswer ?? input.trim();
        if (auto && !userAnswer && messages.length > 1) {
            userAnswer = "No Answer";
        }

        // Manual send with empty input → ignore
        if (!auto && !userAnswer) return;

        dispatch(addMessage({ type: 'user', text: userAnswer }));
        dispatch(setInput(''));

        const nextIndex = interviewIndex + 1;


        if (nextIndex === interviewQuestions.length) {
            const answers = messages
                .filter(m => m.type === 'user')
                .map(m => m.text)
                .concat(userAnswer)
                .slice(1); // remove initial system message

            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/users/saveinterview`, {
                    email,
                    question: interviewQuestions,
                    answer: answers
                });
                localStorage.removeItem('persist:root');
                localStorage.removeItem('questionTimers');
                showNotification("Interview submitted successfully", "success");
            } catch (err) {
                console.error(err);
                showNotification("Failed to save Interview", "error");
            }
        }


        if (nextIndex >= interviewQuestions.length) {

            dispatch(addMessage({ type: 'system', text: 'Interview Round Ends. We will contact you!' }));
            showNotification("Interview ends", "info");

        }

        // Remove saved timer for this question
        const timers = JSON.parse(localStorage.getItem('questionTimers') || '{}');
        delete timers[interviewIndex];
        localStorage.setItem('questionTimers', JSON.stringify(timers));

        // Move to next question
        dispatch(setInterviewIndex(nextIndex));

        // Add next system question
        if (nextIndex < interviewQuestions.length) {
            dispatch(addMessage({ type: 'system', text: interviewQuestions[nextIndex] }));
        }
    };


    return (
        <div className='bg-gray-900 relative overflow-hidden h-screen w-screen flex flex-col justify-center items-center'>
            <div ref={userResumeRef} className='bg-gray-700 text-white p-3 h-auto w-auto rounded-3xl'>
                <UserUploadResume
                    submitHandler={submitHandler}
                    handleChange={handleChange}
                    loading={loading}
                />
            </div>


            <div ref={userInfoRef} className='bg-gray-700 fixed bottom-0 text-white p-3 h-auto w-auto rounded-3xl'>
                <UserInformation
                    visible={visible}
                    handleSubmit={validateAndOpenChat}
                    name={name}
                    email={email}
                    phone={phone}
                    onChangeName={(v) => dispatch(setName(v))}
                    onChangeEmail={(v) => dispatch(setEmail(v))}
                    onChangePhone={(v) => dispatch(setPhone(v))}
                />
            </div>

            <div ref={userChatRef} className='bg-gray-700 fixed bottom-0 text-white p-3 h-auto w-auto rounded-3xl' >
                <UserInterviewChat
                    setInput={(v) => dispatch(setInput(v))}
                    handleSend={handleSend}
                    messages={messages}
                    input={input}
                    chatsEndRef={chatsEndRef}
                    timer={timer}
                    isPaused={isPaused}
                />
            </div>
        </div>
    );
};

export default Home;
