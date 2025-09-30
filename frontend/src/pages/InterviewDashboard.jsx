import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InterviewerDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState('');
    const [sortByScore, setSortByScore] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/getcandidates`);
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCandidates = candidates
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sortByScore ? b.interviewScore - a.interviewScore : 0);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-5">
            <h1 className="text-3xl font-bold mb-5">Interviewer Dashboard</h1>

            <div className="flex gap-3 mb-5 ">
                <input 
                    type="text" 
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 rounded w-1/3 text-white"
                />
                <button 
                    onClick={() => setSortByScore(!sortByScore)}
                    className="px-3 py-2 bg-yellow-500 text-black rounded"
                >
                    {sortByScore ? 'Unsort' : 'Sort by Score'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map(candidate => (
                    <div 
                        key={candidate._id} 
                        className="bg-gray-700 p-4 rounded-xl cursor-pointer hover:bg-gray-600"
                        onClick={() => setSelectedCandidate(candidate)}
                    >
                        <h2 className="font-bold text-xl">{candidate.name}</h2>
                        <p>Email: {candidate.email}</p>
                        <p>Phone: {candidate.phone}</p>
                        <p className="mt-2 font-semibold">Score: {candidate.interviewScore ?? 0}</p>
                        <p className="text-gray-300 mt-1">{candidate.interviewSummary ?? 'No summary yet'}</p>
                    </div>
                ))}
            </div>

            {selectedCandidate && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-start pt-10 overflow-y-auto z-50">
                    <div className="bg-gray-800 p-6 rounded-3xl w-11/12 md:w-3/4 lg:w-1/2 relative">
                        <button 
                            onClick={() => setSelectedCandidate(null)}
                            className="absolute top-3 right-3 bg-red-600 px-3 py-1 rounded"
                        >
                            Close
                        </button>
                        <h2 className="text-2xl font-bold mb-4">{selectedCandidate.name}</h2>
                        <p>Email: {selectedCandidate.email}</p>
                        <p>Phone: {selectedCandidate.phone}</p>
                        <p className="font-semibold mt-2">Score: {selectedCandidate.interviewScore ?? 0}</p>
                        <p className="mt-2">{selectedCandidate.interviewSummary ?? 'No summary yet'}</p>

                        <div className="mt-5">
                            {selectedCandidate.interviewQues?.map((q, i) => (
                                <div key={i} className="bg-gray-700 p-3 rounded mb-2">
                                    <p className="font-semibold">Q{i+1}: {q}</p>
                                    <p className="ml-3">A: {selectedCandidate.interviewAns[i]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewerDashboard;
