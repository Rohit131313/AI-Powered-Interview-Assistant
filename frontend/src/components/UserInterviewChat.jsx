import { setPaused } from '../store/slices/chatSlice';
import { useDispatch } from 'react-redux';

const UserInterviewChat = (props) => {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-3 sm:p-5 gap-3">
            
            <div className="flex justify-between items-center">
                <div>
                    {props.isPaused ? (
                        <button
                            onClick={() => dispatch(setPaused(false))}
                            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm sm:text-base"
                        >
                            Resume
                        </button>
                    ) : (
                        <button
                            onClick={() => dispatch(setPaused(true))}
                            className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                        >
                            Pause
                        </button>
                    )}
                </div>
                <div className="text-yellow-400 text-xs sm:text-sm">
                    ⏳ Time left: <span className="font-semibold">{props.timer}s</span>
                </div>
            </div>

            
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-center mt-2">
                Let's Start the Interview
            </h2>
            <div className="w-full h-px bg-gray-400 my-2" />

            
            <div className="flex flex-col h-[65vh] sm:h-[70vh] w-full bg-gray-800 rounded-lg shadow-lg">
                
                <div
                    className="flex-1 overflow-y-auto flex flex-col gap-2 p-2 sm:p-3"
                    id="chats"
                >
                    {props.messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 text-sm sm:text-base rounded-2xl max-w-[80%] md:max-w-[70%] ${msg.type === "user"
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-300 text-black self-start"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={props.chatsEndRef} />
                </div>

                
                <div className="flex gap-2 p-2 border-t border-gray-600 bg-gray-900 rounded-b-lg">
                    <textarea
                        className="flex-1 resize-none border border-gray-400 bg-white text-black rounded-xl p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your answer here..."
                        value={props.input}
                        onChange={(e) => props.setInput(e.target.value)}
                        rows={3}
                    />
                    <button
                        onClick={props.handleSend}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-2 rounded-xl flex justify-center items-center transition-colors"
                    >
                        <i className="ri-send-plane-2-line text-lg sm:text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInterviewChat;
