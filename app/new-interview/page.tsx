import { JobInfoForm } from "@/components/JobInfoForm";

export default async function Page() {
    return (
        <div className="w-3/4 mx-auto p-10 flex flex-col space-y-2">
            <JobInfoForm />
        </div>

    )
}