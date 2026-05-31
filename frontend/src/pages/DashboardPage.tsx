import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from '../lib/axios'
import { useAuthStore } from '../store/authStore'
import { useAgentStore } from '../store/agentStore'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Agent } from '../types'
import { Plus, Trash2, Eye, MoreVertical, Bot, FileText, MessageSquare, BarChart3, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Input } from '../components/ui/input'
import { formatDate } from '../lib/utils'

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { agents, setAgents } = useAgentStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // Fetch dashboard stats
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/dashboard/stats')
      return response.data
    },
    staleTime: 30000,
  })

  // Fetch agents list
  const { data: agentsList } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await axios.get('/agents')
      return response.data.agents || []
    },
    staleTime: 30000,
  })

  useEffect(() => {
    if (agentsList) {
      setAgents(agentsList)
    }
  }, [agentsList, setAgents])

  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      try {
        await axios.delete(`/agents/${agentId}`)
        setAgents(agents.filter((a) => a.id !== agentId))
      } catch (error) {
        console.error('Failed to delete agent:', error)
        alert('Failed to delete agent')
      }
    }
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !filterStatus || agent.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = [
    {
      label: 'Total Agents',
      value: dashboardData?.total_agents || 0,
      icon: Bot,
      color: 'from-blue-600 to-blue-400',
    },
    {
      label: 'PDFs Uploaded',
      value: dashboardData?.total_pdfs || 0,
      icon: FileText,
      color: 'from-purple-600 to-purple-400',
    },
    {
      label: 'Total Conversations',
      value: dashboardData?.total_chats || 0,
      icon: MessageSquare,
      color: 'from-pink-600 to-pink-400',
    },
    {
      label: 'Active Widgets',
      value: dashboardData?.total_widgets || 0,
      icon: BarChart3,
      color: 'from-green-600 to-green-400',
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-slate-400 text-lg">
              Manage your AI agents and track performance
            </p>
          </div>
          <Button
            onClick={() => navigate('/agents/create')}
            className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 h-11"
          >
            <Plus className="w-5 h-5" />
            Create Agent
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-slate-600 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg opacity-80`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Agents Section */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Your Agents</h2>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 pl-10"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus(filterStatus === 'active' ? null : 'active')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    filterStatus === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus(filterStatus === 'processing' ? null : 'processing')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    filterStatus === 'processing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  Processing
                </button>
              </div>
            </div>
          </div>

          {/* Agents Table */}
          <div className="overflow-x-auto">
            {filteredAgents.length === 0 ? (
              <div className="p-12 text-center">
                <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">
                  {agents.length === 0 ? 'No agents yet. Create your first one!' : 'No agents match your filters'}
                </p>
                {agents.length === 0 && (
                  <Button
                    onClick={() => navigate('/agents/create')}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Agent
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-300">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300">Description</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-300">Created</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent: Agent) => (
                    <tr key={agent.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{agent.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-slate-400 max-w-xs truncate">
                          {agent.description}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            agent.status === 'active'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : agent.status === 'processing'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            agent.status === 'active'
                              ? 'bg-green-400 animate-pulse'
                              : agent.status === 'processing'
                              ? 'bg-yellow-400 animate-pulse'
                              : 'bg-red-400'
                          }`} />
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {formatDate(agent.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem
                              onClick={() => navigate(`/agents/${agent.id}`)}
                              className="text-slate-200 hover:bg-slate-700/50 cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAgent(agent.id)}
                              className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default DashboardPage