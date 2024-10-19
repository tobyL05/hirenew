'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from 'lucide-react'

interface FormData {
  name: string
  jobTitle: string
  jobDescription: string
  companyName: string
  additionalQs: string[]
}

export function JobInfoForm() {
  const [fields, setFields] = useState<string[]>([''])
  const [result, setResult] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    jobTitle: '',
    jobDescription: '',
    companyName: '',
    additionalQs: ['']
  })

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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nonEmptyFields = fields.filter(field => field.trim() !== '')
    setFormData(prevData => ({
        ...prevData,
        additionalQs: nonEmptyFields
    }))
    console.log(formData)
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
    </Card>
  )
}