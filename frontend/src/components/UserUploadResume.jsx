
const UserUploadResume = (props) => {

    return (
        <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl p-3">
            
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4'>Application for Fullstack Developer</h2>
            <div className="w-full h-px bg-gray-300 my-2 sm:my-4" />

            
            <form onSubmit={props.submitHandler} className="flex flex-col gap-4 w-full px-3 sm:px-6">
                <div className='flex flex-col gap-3 w-full p-4 rounded-2xl bg-gray-800'>
                    <h4 className='font-light text-white'>Upload your resume here to apply</h4>

                    
                    <input
                        onChange={props.handleChange}
                        className='block underline hover:text-indigo-500 cursor-pointer text-sm sm:text-base'
                        type="file"
                    />

                    
                    <button
                        type="submit"
                        className="w-full mt-4 p-2 sm:p-3 text-black border-2 border-green-500 rounded-2xl bg-green-500 hover:bg-green-600 hover:text-white transition-all"
                    >
                        Submit
                    </button>

                    
                    {props.loading && (
                        <div className='text-center text-red-300 font-bold mt-2 text-sm sm:text-base'>
                            {props.loading}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

export default UserUploadResume;

