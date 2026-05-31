import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Brain, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'

function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/dashboard')
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Implement email login
      console.log('Email login:', email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 animate-pulse" />
                <div className="relative bg-slate-900 p-3 rounded-xl">
                  <Brain className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
            <p className="text-slate-400">Create and deploy intelligent AI agents</p>
          </div>

          {/* Main card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 mb-8">Sign in to your account to continue</p>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-medium py-3 px-4 rounded-lg transition mb-6 border border-slate-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-slate-400 bg-slate-800/50">or</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400">Fast Setup</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400">Secure</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-400">Powerful</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage