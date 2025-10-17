import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Label } from '@/components/ui/label.jsx'
import { announcementsService } from './lib/firestore.js'
import { DEFAULT_ANNOUNCEMENTS } from './lib/constants.js'
import { Lock, Plus, Edit, Trash, Save, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import ammstroLogo from '/assets/ammstro-logo.png'

export default function AnnouncementsAdmin() {
  const [authorized, setAuthorized] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    if (!authorized) return
    const unsubscribe = announcementsService.onAnnouncementsChange((items) => {
      const sorted = [...items].sort((a, b) => {
        const pa = typeof a.position === 'number' ? a.position : Infinity
        const pb = typeof b.position === 'number' ? b.position : Infinity
        if (pa !== pb) return pa - pb
        const ca = a.createdAt?.seconds || 0
        const cb = b.createdAt?.seconds || 0
        return cb - ca
      })
      setAnnouncements(sorted)
    })
    return () => unsubscribe && unsubscribe()
  }, [authorized])

  const submitAccessCode = () => {
    if (accessCode === '007') {
      setAuthorized(true)
      setError('')
    } else {
      setError('Invalid access code. Please try again.')
    }
  }

  const addAnnouncement = async () => {
    const text = newText.trim()
    if (!text) return
    // Determine next position
    const nextPosition = announcements.length > 0
      ? Math.max(...announcements.map(a => typeof a.position === 'number' ? a.position : 0)) + 1
      : 1
    await announcementsService.addAnnouncement(text, nextPosition)
    setNewText('')
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditingText(item.text)
  }

  const saveEdit = async () => {
    if (!editingId) return
    const text = editingText.trim()
    if (!text) return
    await announcementsService.updateAnnouncement(editingId, { text })
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const removeAnnouncement = async (id) => {
    await announcementsService.deleteAnnouncement(id)
  }

  const toggleVisibility = async (item) => {
    const currentlyVisible = item.visible !== false
    const nextVisible = !currentlyVisible
    await announcementsService.updateAnnouncement(item.id, { visible: nextVisible })
  }

  const seedDefaults = async () => {
    if (announcements.length > 0) return
    for (let i = 0; i < DEFAULT_ANNOUNCEMENTS.length; i++) {
      await announcementsService.addAnnouncement(DEFAULT_ANNOUNCEMENTS[i], i + 1)
    }
  }

  const moveUp = async (index) => {
    if (index <= 0) return
    const curr = announcements[index]
    const prev = announcements[index - 1]
    const p1 = prev.position ?? index
    const p2 = curr.position ?? index + 1
    await announcementsService.updateAnnouncement(prev.id, { position: p2 })
    await announcementsService.updateAnnouncement(curr.id, { position: p1 })
  }

  const moveDown = async (index) => {
    if (index >= announcements.length - 1) return
    const curr = announcements[index]
    const next = announcements[index + 1]
    const p1 = curr.position ?? index + 1
    const p2 = next.position ?? index + 2
    await announcementsService.updateAnnouncement(curr.id, { position: p2 })
    await announcementsService.updateAnnouncement(next.id, { position: p1 })
  }

  // Auto-seed defaults once, after admin authorization, if the collection is empty
  useEffect(() => {
    const run = async () => {
      if (!authorized) return
      try {
        const list = await announcementsService.getAnnouncements()
        if (!list || list.length === 0) {
          for (let i = 0; i < DEFAULT_ANNOUNCEMENTS.length; i++) {
            await announcementsService.addAnnouncement(DEFAULT_ANNOUNCEMENTS[i], i + 1)
          }
        }
      } catch (e) {
        console.error('Error checking/seeding announcements:', e)
      }
    }
    run()
  }, [authorized])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white text-slate-900 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Admin Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accessCode" className="text-slate-700">Access Code</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitAccessCode()
                  }}
                  className="border-slate-300 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                />
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={submitAccessCode}>Enter</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Top navigation bar to match main site style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AMMSTRO</span>
            </div>
            <a href="/" className="text-slate-600 hover:text-slate-900">Back to site</a>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-10 pt-24">
        <div className="mb-6">
          <Badge className="bg-sky-100 text-sky-700 border-sky-300">Announcements</Badge>
          <h1 className="text-2xl font-bold mt-3">Manage Rotating Display Messages</h1>
          <p className="text-slate-600 mt-1">Add, edit, or remove the messages shown on the homepage ticker.</p>
        </div>

        <Card className="mb-6 bg-white text-slate-900 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Add New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. ✈️ New STC approved for composite blade"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <Button onClick={addAnnouncement}><Plus className="w-4 h-4 mr-2" />Add</Button>
              <Button variant="outline" onClick={seedDefaults} title="Seed defaults when list is empty">Seed Defaults</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {announcements.map((item, index) => (
            <Card key={item.id} className="bg-white text-slate-900 border-slate-200">
              <CardContent className="py-4">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <Button onClick={saveEdit}><Save className="w-4 h-4 mr-2" />Save</Button>
                    <Button variant="outline" onClick={cancelEdit}><X className="w-4 h-4 mr-2" />Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-800">{item.text}</p>
                      {item.visible === false && (
                        <Badge className="bg-slate-200 text-slate-700 border-slate-300">Hidden</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => moveUp(index)} title="Move up"><ArrowUp className="w-4 h-4" /></Button>
                      <Button variant="ghost" onClick={() => moveDown(index)} title="Move down"><ArrowDown className="w-4 h-4" /></Button>
                      <Button variant="ghost" onClick={() => toggleVisibility(item)} title={item.visible === false ? 'Show on homepage' : 'Hide from homepage'}>
                        {item.visible === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" onClick={() => startEdit(item)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                      <Button variant="destructive" onClick={() => removeAnnouncement(item.id)}><Trash className="w-4 h-4 mr-2" />Delete</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {announcements.length === 0 && (
            <p className="text-slate-600">No announcements yet. Add your first message above.</p>
          )}
        </div>
      </div>
    </div>
  )
}