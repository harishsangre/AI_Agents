import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from '../lib/axios'
import Layout from '../components/Layout'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Loader, ArrowLeft, Copy, CheckCircle, Settings, FileText, Code, BarChart3 } from 'lucide-react'
import { formatDate } from '../lib/utils'

function AgentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'embed' | 'analytics'>('overview')

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const response = await axios.get(`/agents/${id}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!agent) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">Agent not found</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Layout>
    )
  }

  const embedCode = `<script src="https://app.domain.com/widget.js" data-widget-id="${agent.widgetId}"><\/script>`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{agent.name}</h1>
              <p className="text-slate-400 text-lg max-w-2xl">{agent.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 gap-2 h-11"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Status</p>
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  agent.status === 'active'
                    ? 'bg-green-400 animate-pulse'
                    : agent.status === 'processing'
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-red-400'
                }`}
              />
              <p className="text-2xl font-bold text-white capitalize">{agent.status}</p>
            </div>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Knowledge Base</p>
            <p className="text-2xl font-bold text-white">{agent.pdfCount || 0} PDFs</p>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Created</p>
            <p className="text-sm text-white font-mono break-all">{formatDate(agent.createdAt)}</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700/50">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'embed', label: 'Embed Widget', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'embed' | 'analytics')}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-blue-500'
                    : 'text-slate-400 hover:text-slate-300 border-b-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Widget ID</h3>
                <code className="block bg-slate-900/50 text-slate-300 p-4 rounded-lg font-mono text-sm break-all">
                  {agent.widgetId}
                </code>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Vector Namespace</h3>
                <code className="block bg-slate-900/50 text-slate-300 p-4 rounded-lg font-mono text-sm break-all">
                  {agent.vectorNamespace}
                </code>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'embed' && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Embed Your Chat Widget</h3>
                <p className="text-slate-400 mb-6">
                  Copy the code below and paste it into your website to add the chat widget:
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg overflow-x-auto">
                <pre className="font-mono text-sm text-slate-300">
                  <code>{embedCode}</code>
                </pre>
              </div>

              <Button
                onClick={copyToClipboard}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Embed Code
                  </>
                )}
              </Button>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  <strong>Tip:</strong> The widget will appear as a floating chat bubble on your website.
                  Users can click it to chat with your AI agent.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default AgentDetailPage