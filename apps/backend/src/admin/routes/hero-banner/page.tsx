// File: apps/backend/src/admin/routes/hero-banner/page.tsx
// --- PART 2 ---

import { useState, useEffect } from "react"
import { Container, Heading, Button, Input, Textarea, toast } from "@medusajs/ui"
import { Sparkles } from "@medusajs/icons"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const HeroBannerPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [banner, setBanner] = useState({
    id: "",
    badge_text: "",
    headline_top: "",
    headline_bottom: "",
    description: "",
    image_url: ""
  })

  // Load the current banner data when the page opens
  useEffect(() => {
    fetch("/admin/hero-banner")
      .then((res) => res.json())
      .then((data) => {
        if (data.banner) setBanner(data.banner)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch banner", err)
        setIsLoading(false)
      })
  }, [])

  // Save the new data to the database
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/admin/hero-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner)
      })
      if (res.ok) {
        toast.success("Hero Banner updated successfully!")
      } else {
        toast.error("Failed to update Hero Banner.")
      }
    } catch (error) {
      toast.error("An error occurred while saving.")
    }
    setIsSaving(false)
  }

// End of Part 2
// --- PART 3 ---

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading banner data...</p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-8">
        <Heading level="h1">Manage Hero Banner</Heading>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
      
      <div className="flex flex-col gap-y-6 max-w-2xl">
        <div>
          <label className="text-ui-fg-base text-sm font-medium mb-2 block">Promo Badge Text</label>
          <Input 
            value={banner.badge_text} 
            onChange={(e) => setBanner({...banner, badge_text: e.target.value})} 
            placeholder="e.g., ✨ Exclusive Summer Event"
          />
        </div>

        <div>
          <label className="text-ui-fg-base text-sm font-medium mb-2 block">Headline (Top Line)</label>
          <Input 
            value={banner.headline_top} 
            onChange={(e) => setBanner({...banner, headline_top: e.target.value})} 
            placeholder="e.g., Discover Your"
          />
        </div>

        <div>
          <label className="text-ui-fg-base text-sm font-medium mb-2 block">Headline (Bottom Line)</label>
          <Input 
            value={banner.headline_bottom} 
            onChange={(e) => setBanner({...banner, headline_bottom: e.target.value})} 
            placeholder="e.g., Perfect Style"
          />
        </div>

        <div>
          <label className="text-ui-fg-base text-sm font-medium mb-2 block">Description</label>
          <Textarea 
            value={banner.description} 
            onChange={(e) => setBanner({...banner, description: e.target.value})} 
            placeholder="Enter the description text..."
            rows={4}
          />
        </div>

        <div>
          <label className="text-ui-fg-base text-sm font-medium mb-2 block">Background Image URL</label>
          <Input 
            value={banner.image_url} 
            onChange={(e) => setBanner({...banner, image_url: e.target.value})} 
            placeholder="https://..."
          />
          {banner.image_url && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 h-48 w-full relative">
              <img src={banner.image_url} alt="Banner Preview" className="object-cover w-full h-full" />
            </div>
           )}
        </div>
      </div>
    </Container>
  )
}

export default HeroBannerPage

// This adds the page to your Admin Sidebar with a Picture icon!
export const config = defineRouteConfig({
  label: "Hero Banner",
  icon: Sparkles,
})
// --- END OF CODE ---
