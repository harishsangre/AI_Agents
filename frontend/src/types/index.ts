export interface User {
  id: string
  googleId?: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  tenantId: string
  name: string
  description: string
  widgetId: string
  vectorNamespace: string
  status: 'active' | 'processing' | 'error'
  pdfCount: number
  createdAt: string
  updatedAt: string
}

export interface PDFFile {
  id: string
  tenantId: string
  agentId: string
  originalFileName: string
  storagePath: string
  size: number
  mimeType: string
  createdAt: string
}

export interface Widget {
  id: string
  tenantId: string
  agentId: string
  widgetKey: string
  embedCode: string
  createdAt: string
}

export interface ChatSession {
  id: string
  tenantId: string
  agentId: string
  visitorId: string
  messages: ChatMessage[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}