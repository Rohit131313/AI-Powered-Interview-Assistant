
const UserInformation = (props) => {

    return (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl p-3">
            
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4'>Enter the Required Information</h2>
            <div className="w-full h-px bg-gray-300 my-2 sm:my-4" />

            
            <form onSubmit={props.handleSubmit} className="flex flex-col gap-4 w-full px-3 sm:px-6">
                <div className='flex flex-col gap-3 w-full p-2 rounded-2xl bg-gray-800'>
                    {props.visible.name &&
                        <input
                            className="block w-full border border-black p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            placeholder="Enter your name"
                            value={props.name}
                            onChange={(e) => props.onChangeName(e.target.value)}
                        />
                    }
                    {props.visible.email &&
                        <input
                            className="block w-full border border-black p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            placeholder="Enter your email address"
                            value={props.email}
                            onChange={(e) => props.onChangeEmail(e.target.value)}
                        />}
                    {props.visible.phone &&
                        <input
                            className="block w-full border border-black p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                            type="text"
                            placeholder="Enter your phone number"
                            value={props.phone}
                            onChange={(e) => props.onChangePhone(e.target.value)}
                        />}
                    
                    <button
                        type="submit"
                        className="w-full mt-4 p-2 sm:p-3 text-black border-2 border-green-500 rounded-2xl bg-green-500 hover:bg-green-600 hover:text-white transition-all"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserInformation;

