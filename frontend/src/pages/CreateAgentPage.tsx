import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from '../lib/axios'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Upload, ArrowLeft, Loader, FileUp, AlertCircle } from 'lucide-react'

const createAgentSchema = z.object({
  name: z.string().min(2, 'Agent name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
})

type CreateAgentFormData = z.infer<typeof createAgentSchema>

function CreateAgentPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    const pdfFiles = Array.from(files).filter((f) => f.type === 'application/pdf')
    if (pdfFiles.length > 0) {
      setPdfFile(pdfFiles[0])
      setError(null)
    } else {
      setError('Please drop a PDF file')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setPdfFile(file)
      setError(null)
    }
  }

  const onSubmit = async (data: CreateAgentFormData) => {
    if (!pdfFile) {
      setError('Please select a PDF file')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('pdf', pdfFile)

      const response = await axios.post('/agents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      navigate(`/agents/${response.data.id}`)
    } catch (error) {
      console.error('Failed to create agent:', error)
      setError('Failed to create agent. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Create New Agent</h1>
            <p className="text-slate-400 mt-2">
              Set up a new AI agent with its knowledge base
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Agent Name */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Agent Name
              </label>
              <Input
                placeholder="e.g., Customer Support Bot"
                {...register('name')}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 h-11"
              />
              {errors.name && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Description
              </label>
              <Textarea
                placeholder="Describe what this agent will do and how it will help users..."
                rows={4}
                {...register('description')}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
              {errors.description && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* PDF Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Knowledge Base (PDF)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('pdf-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : pdfFile
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/20'
                }`}
              >
                {pdfFile ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
                      <FileUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{pdfFile.name}</p>
                      <p className="text-sm text-slate-400">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700/50 rounded-lg">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Drag and drop your PDF</p>
                      <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                      <p className="text-xs text-slate-500 mt-2">Max 50MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              {error && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-slate-700/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !pdfFile}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Creating Agent...' : 'Create Agent'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

export default CreateAgentPage