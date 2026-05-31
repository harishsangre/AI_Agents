import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft, LogOut, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../lib/utils'

function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [copiedId, setCopiedId] = useState(false)

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout()
      navigate('/login')
    }
  }

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
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
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 mt-2">Manage your account and preferences</p>
          </div>
        </div>

        {/* Account Information */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Name</label>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Email</label>
              <p className="text-lg font-semibold text-white">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Role</label>
              <p className="text-lg font-semibold text-white capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">User ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-900/50 text-slate-300 p-3 rounded-lg font-mono text-sm break-all">
                  {user?.id}
                </code>
                <button
                  onClick={copyUserId}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition text-slate-400 hover:text-white"
                >
                  {copiedId ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 block mb-2">Member Since</label>
              <p className="text-lg font-semibold text-white">{formatDate(user?.createdAt || '')}</p>
            </div>
          </div>
        </Card>

        {/* API Settings */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">API Settings</h2>
          <p className="text-slate-400 mb-6">
            Generate API keys to access the platform programmatically
          </p>
          <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50">
            Generate API Key
          </Button>
        </Card>

        {/* Security */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
          <div className="space-y-4">
            <p className="text-slate-400">
              Your account is secured with Google OAuth 2.0 authentication
            </p>
            <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Sign Out */}
        <Card className="bg-red-950/30 border-red-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Sign Out</h2>
          <p className="text-slate-400 mb-6">
            Sign out of your account. You can sign back in anytime.
          </p>
          <Button
            onClick={handleLogout}
            className="gap-2 bg-red-600/80 hover:bg-red-700 text-white font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>
      </div>
    </Layout>
  )
}

export default SettingsPage