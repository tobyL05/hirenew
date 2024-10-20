"use client"
import MenuItem from "@/components/MenuItem"
import { useAddUserStore } from "@/stores/useAddUserStore"
import { useState } from "react"
import { useEffect } from "react"

interface interview {
    interview_record: any
    name: string
    job_desc: string
    role: string
    company: string
    transcript: string
    evaluation: string
}

export default function Page() {
    const users = useAddUserStore((state) => state.users)
    const [interviews, setInterviews] = useState<interview[]>([])
    const [normalInterviews, setNormalInterviews] = useState<interview[]>([])
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


    useEffect(() => {
        const getAll = async () => {
            const req = await fetch("http://localhost:3001/all")
            const res = await req.json()
            setNormalInterviews(res.sort(()=> Math.random()-0.5))
            // const rankedCandidates: any[] = [];
            // res.forEach((candidate, index) => {
            // const firstName = candidate.name.split(' ')[0];
            // const fileName = `${firstName}.json`;
            // try {
            //     // Read each JSON file named after the candidate's first name
            //     const data = 
            //     const candidateDetails = JSON.parse(data);
            //     // Calculate normalised value
            //     const normalisedValue = (index + 1) * candidateDetails.confidence;
            //     // Create the ranked candidate object
            //     const rankedCandidate = {
            //     name: candidate.name,
            //     normalised_value: normalisedValue,
            //     };
            //     // Add optional properties if they exist
            //     if (candidateDetails.fprojects) {
            //     rankedCandidate.fprojects = candidateDetails.fprojects;
            //     }
            //     if (candidateDetails.fexperiences) {
            //     rankedCandidate.fexperiences = candidateDetails.fexperiences;
            //     }
            //     // Add the ranked candidate to the list
            //     rankedCandidates.push(rankedCandidate);
            // } catch (error) {
            //     console.error(`Error reading file ${fileName}:`, error);
            // }
            // });
            // // Sort candidates by normalised value in descending order
            // rankedCandidates.sort((a, b) => b.normalised_value - a.normalised_value);
            // // Display the candidates in the desired format
            // console.log('Authenticity Normalised Ranking:');
            // rankedCandidates.forEach((candidate) => {
            // console.log(candidate);
            // });
            console.log(res)
            setInterviews(res)
        }
        getAll();
    },[])

    return (
       <div className="w-3/4 mx-auto mt-20">
            <h1 className="text-3xl text-center mb-10">Recruiter Dashboard</h1>
                <div className="flex flex-col space-y-3">
                    <h1 className="mb-3 text-xl">Candidate Ranking</h1>
                    {users.map((interview, idx) => {
                        return (
                            <div className="flex w-full align-middle items-center space-x-3">
                                <span>{idx + 1}</span>
                                <MenuItem key={idx} label={`${interview.name} (${interview.role}) @ ${interview.company}`}>
                                    <></>
                                    {/* <div className="w-3/4 mx-auto"> */}
                                        {/* {insights} */}
                                    {/* </div> */}
                                </MenuItem>
                            </div>
                        ) 
                    })}
                </div>
       </div> 
    )
}