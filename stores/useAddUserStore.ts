import { create } from "zustand"

interface interview {
    interview_record: any
    name: string
    job_desc: string
    role: string
    company: string
    transcript: string
    evaluation: string
}

interface Users {
    users: interview[]
    addUser: (newUser: interview) => void
}

export const useAddUserStore = create<Users>((set) => ({
    users: [
        {
            company: "Spotify",
            name: "Toby Lau",
            job_desc: "",
            role: "Software Engineer",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "Data Insights",
            name: "Michael Lee",
            job_desc: "",
            role: "Data Scientist",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "CloudTech",
            name: "Emily Johnson",
            job_desc: "",
            role: "Cloud Engineer",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "Product Innnovations",
            name: "Sarah Williams",
            job_desc: "",
            role: "Product Manager",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "TechCorp",
            name: "Jane Doe",
            job_desc: "",
            role: "Software Engineer",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "TechCorp",
            name: "Alice Smith",
            job_desc: "",
            role: "Software Engineer",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
        {
            company: "M&M",
            name: "Mayur",
            job_desc: "",
            role: "Software Engineer",
            evaluation: "",
            interview_record: "",
            transcript: "",
        },
    ],
    addUser: (newUser: interview) => set((state) => ({ users: [...state.users,newUser]}))
}))