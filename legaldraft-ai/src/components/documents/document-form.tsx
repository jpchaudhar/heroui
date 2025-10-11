"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentTemplate, TemplateField } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface DocumentFormProps {
  template: DocumentTemplate
  onSubmit: (formData: Record<string, string>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DocumentForm({ template, onSubmit, onCancel, isLoading }: DocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const renderField = (field: TemplateField) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || field.defaultValue || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            className="min-h-[100px]"
          />
        )
      
      case "select":
        return (
          <Select
            value={formData[field.id] || field.defaultValue || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case "date":
        return (
          <Input
            {...commonProps}
            type="date"
          />
        )
      
      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
          />
        )
      
      case "email":
        return (
          <Input
            {...commonProps}
            type="email"
          />
        )
      
      default:
        return (
          <Input
            {...commonProps}
            type="text"
          />
        )
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create {template.name}</CardTitle>
        <CardDescription>
          Fill in the required information to generate your legal document
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
          
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Document
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}