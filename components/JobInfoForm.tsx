'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from 'lucide-react'
import { useAddUserStore } from '@/stores/useAddUserStore'

interface FormData {
  name: string
  jobTitle: string
  jobDescription: string
  companyName: string
  LinkedInProfile: string
  GitHubProfile: string
  additionalQs: string[]
}

export function JobInfoForm() {
  const [fields, setFields] = useState<string[]>([''])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    jobTitle: '',
    jobDescription: '',
    companyName: '',
    LinkedInProfile: '',
    GitHubProfile: '',
    additionalQs: ['']
  })

  const [uid, setUid] = useState<string | null>(null) // For showing UID response
  const addUser = useAddUserStore((state) => state.addUser)

  const addField = () => { setFields([...fields, ''])
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  // additional fields
  const handleAdditionalFields = (index: number, value: string) => {
    const newFields = [...fields]
    newFields[index] = value
    setFields(newFields)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submit")
    e.preventDefault()

    // Concatenate additional questions
    const concatenatedQs = fields.filter(field => field.trim() !== '')

    // Prepare the payload for the API call
    const payload = {
      name: formData.name,
      role: formData.jobTitle,
      jobDescription: formData.jobDescription,
      company: formData.companyName,
      linkedinProfile: formData.LinkedInProfile,
      githubProfile: formData.GitHubProfile,
      questions: concatenatedQs
    }

    addUser({
        name: formData.name,
        company: formData.companyName,
        role: formData.jobTitle,
        job_desc: formData.jobDescription,
        evaluation: "",
        interview_record: "",
        transcript: ""
    })

    // const regex = /https:\/\/www\.linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/;
  
    // // Test the URL and extract the profile ID if it matches
    // const match = url.match(regex);
    
    // Return the profile ID or null if no match is found
    // return match ? match[1] : null;
    const liregex = /https:\/\/www\.linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/;
    console.log("LI",liregex)
    const linkedinid = formData.LinkedInProfile.match(liregex)![1];
    const ghregex = /https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/?/;
    const ghid = formData.GitHubProfile.match(ghregex)![1];

    
    const payload2 = {
        "cid": formData.name,
        "linkedin": linkedinid,
        "github": ghid
    }

    try {
      const response = await fetch('http://localhost:3001/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const result = await response.json()

      await fetch('http://127.0.0.1:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload2)
      })

      if (response.ok) {
        // Store the returned UID and show it to the user
        setUid(result.id)
      } else {
        console.error("Failed to submit data:", result)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Application Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter candidate name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter the job title"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Enter the job description here"
              required
              className="w-full min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
              className="w-full"
            />
            </div>
          <div className="space-y-2">
            <Label htmlFor="LinkedInProfile">Candidate LinkedIn Profile</Label>
            <Input
              id="LinkedInProfile"
              name="LinkedInProfile"
              value={formData.LinkedInProfile}
              onChange={handleChange}
              placeholder="Enter the candidate's LinkedIn Profile"
              required
              className="w-full"
            />
          <div className="space-y-2">
            <Label htmlFor="GitHubProfile">Candidate GitHub Profile</Label>
            <Input
              id="GitHubProfile"
              name="GitHubProfile"
              value={formData.GitHubProfile}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
              className="w-full"
            />
            </div>
            <br></br>
            <Label>Additional Questions</Label>
            {fields.map((field, index) => (
              <div key={index} className="flex items-center">
                <Label htmlFor={`field-${index}`} className="sr-only">
                  Field {index + 1}
                </Label>
                <Input
                  id={`field-${index}`}
                  value={field}
                  onChange={(e) => handleAdditionalFields(index, e.target.value)}
                  placeholder={`Enter additional questions here`}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addField}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit</Button>
        </CardFooter>
      </form>

      {uid && (
        <CardContent className="mt-4">
          <p>Your interview ID is: <strong>{uid}</strong></p>
          <p>
            Access it at: <a href={`${window.location.origin}/interviews/${uid}`} className="text-blue-500">{`${window.location.origin}/interviews/${uid}`}</a>
          </p>
        </CardContent>
      )}
    </Card>
  )
}