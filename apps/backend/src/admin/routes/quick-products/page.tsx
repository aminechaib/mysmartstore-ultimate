// File: apps/backend/src/admin/routes/quick-products/page.tsx

import { useState, useEffect } from "react"
import { Container, Heading, Button, Input, Label, Select, toast, Text } from "@medusajs/ui"
import { BoltSolid } from "@medusajs/icons"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const QuickProductsPage = () => {
  const [collections, setCollections] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [warranty, setWarranty] = useState("")
  const [sku, setSku] = useState("")
  const [collectionId, setCollectionId] = useState("none")
  const [file, setFile] = useState<File | null>(null)

  // Fetch collections for the dropdown
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/admin/collections?limit=100")
        const data = await res.json()
        setCollections(data.collections || [])
      } catch (error) {
        toast.error("Failed to load collections")
      }
    }
    fetchCollections()
  }, [])

  const resetForm = () => {
    setTitle("")
    setPrice("")
    setDescription("")
    setWarranty("")
    setSku("")
    setCollectionId("none")
    setFile(null)
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) {
      toast.error("Product Name and Price are required!")
      return
    }

    setIsSaving(true)
    let imageUrl = ""

    try {
      // 1. Upload the image first (if selected)
      if (file) {
        const formData = new FormData()
        formData.append("files", file)
        const uploadRes = await fetch("/admin/uploads", { method: "POST", body: formData })
        if (!uploadRes.ok) throw new Error("Failed to upload image")
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.files[0].url
      }

      // 2. Send the data to our custom backend API
      const res = await fetch("/admin/quick-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          warranty,
          sku,
          collection_id: collectionId,
          image_url: imageUrl,
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Tech Product created successfully!")
        resetForm()
      } else {
        toast.error(data.error || "Failed to create product")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    }
    
    setIsSaving(false)
  }

  return (
    <Container className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <Heading level="h1" className="text-2xl font-bold">⚡ Quick Add Tech Product</Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Add a new product to your catalog instantly. The system will automatically configure the QAR pricing and backend architecture.
        </Text>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 bg-ui-bg-subtle p-6 rounded-lg border">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Product Name *</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., iPhone 15 Pro Max" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold">Price (QAR) *</Label>
            <Input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 4500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Reference / SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g., APPL-IP15-PRO (Leave blank to auto-generate)" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold">Warranty Information</Label>
            <Input value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="e.g., 1 Year Apple Care" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-bold">Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the product..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Collection</Label>
            <Select value={collectionId} onValueChange={setCollectionId}>
              <Select.Trigger><Select.Value placeholder="Select collection" /></Select.Trigger>
              <Select.Content>
                <Select.Item value="none">-- No Collection --</Select.Item>
                {collections.map(c => (
                  <Select.Item key={c.id} value={c.id}>{c.title}</Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-bold">Product Picture</Label>
            <Input id="image-upload" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button type="submit" variant="primary" isLoading={isSaving} size="large">
            Create Product
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default QuickProductsPage

export const config = defineRouteConfig({
  label: "Quick Add",
  icon: BoltSolid,
})
