// File: apps/backend/src/admin/routes/marketing-badges/page.tsx

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Label } from "@medusajs/ui"
import { useState, useEffect } from "react"

const MarketingBadgesPage = () => {
  const [badges, setBadges] = useState<any[]>([])
  const [handle, setHandle] = useState("")
  const [text, setText] = useState("")
  const [bgClass, setBgClass] = useState("bg-gradient-to-r from-red-500 to-orange-500")
  const [cardStyle, setCardStyle] = useState("ring-1 ring-red-500/20 shadow-lg")

  const fetchBadges = async () => {
    const res = await fetch("/admin/marketing-badges")
    const data = await res.json()
    if (data.badges) setBadges(data.badges)
  }

  useEffect(() => {
    fetchBadges()
  }, [])

  const handleSave = async () => {
    if (!handle || !text) return alert("Handle and Text are required!")
    
    await fetch("/admin/marketing-badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collection_handle: handle,
        text,
        bg_class: bgClass,
        card_style: cardStyle
      })
    })
    
    alert("Badge Saved Successfully!")
    // Clear the form after saving
    setHandle("")
    setText("")
    fetchBadges()
  }

  // Load badge data into the form for editing
  const handleEdit = (badge: any) => {
    setHandle(badge.collection_handle)
    setText(badge.text)
    setBgClass(badge.bg_class)
    setCardStyle(badge.card_style)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Delete the badge
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this badge?")) return

    await fetch(`/admin/marketing-badges/${id}`, {
      method: "DELETE"
    })
    
    fetchBadges()
  }

  return (
    <Container className="p-8 flex flex-col gap-8">
      <div>
        <Heading className="text-2xl font-bold">Marketing Badges</Heading>
        <Text className="text-ui-fg-subtle mt-2">
          Create dynamic badges (like "-20% OFF" or "✨ NEW") for your collections.
        </Text>
      </div>

      <div className="flex flex-col gap-4 max-w-md bg-ui-bg-subtle p-6 rounded-lg border">
        <Heading level="h2" className="text-lg">Add / Edit Badge</Heading>
        
        <div className="flex flex-col gap-2">
          <Label>Collection Handle (e.g., "hot" or "new")</Label>
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="hot" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Badge Text & Emoji</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="✨ JUST DROPPED" />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Background Tailwind Classes</Label>
          <Input value={bgClass} onChange={(e) => setBgClass(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Card Hover Style Classes</Label>
          <Input value={cardStyle} onChange={(e) => setCardStyle(e.target.value)} />
        </div>

        <Button variant="primary" onClick={handleSave} className="mt-4">
          Save Badge
        </Button>
      </div>

      <div>
        <Heading level="h2" className="text-lg mb-4">Active Badges</Heading>
        <div className="flex flex-col gap-4">
          {badges.map(b => (
            <div key={b.id} className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Text className="font-bold">Collection: {b.collection_handle}</Text>
                <Text className="text-sm text-ui-fg-subtle">Text: {b.text}</Text>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Preview of the badge */}
                <div className={`px-3 py-1 text-white text-xs font-bold rounded-md ${b.bg_class}`}>
                  {b.text}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="secondary" size="small" onClick={() => handleEdit(b)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(b.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {badges.length === 0 && (
            <Text className="text-ui-fg-subtle">No badges created yet.</Text>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Marketing Badges",
  icon: "TagSolid",
})

export default MarketingBadgesPage
