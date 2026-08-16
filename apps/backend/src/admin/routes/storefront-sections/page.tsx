// File: apps/backend/src/admin/routes/storefront-sections/page.tsx

import { useState, useEffect } from "react"
import { Container, Heading, Table, Button, Input, Label, Select, toast, IconButton, Checkbox } from "@medusajs/ui"
import { Window, Trash, PencilSquare, ArrowUpMini, ArrowDownMini } from "@medusajs/icons"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const StorefrontSectionsPage = () => {
  const [sections, setSections] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [type, setType] = useState("hero")
  const [collectionId, setCollectionId] = useState("none")
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [animation, setAnimation] = useState("fade-up")
  
  // Dynamic Button State
  const [showButton, setShowButton] = useState(true)
  const [buttonText, setButtonText] = useState("Shop Now")
  const [buttonLink, setButtonLink] = useState("/store")

  // 🛠️ NEW: Multiple Collections & Limit State
  const [collectionIds, setCollectionIds] = useState<string[]>([])
  const [limit, setLimit] = useState<number>(8)

  const fetchData = async () => {
    try {
      const secRes = await fetch("/admin/storefront-sections")
      const secData = await secRes.json()
      setSections(secData.sections || secData.storefront_sections || [])

      const colRes = await fetch("/admin/collections?limit=100")
      const colData = await colRes.json()
      setCollections(colData.collections || [])
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setType("hero")
    setCollectionId("none")
    setFile(null)
    setImageUrl("")
    setAnimation("fade-up")
    setShowButton(true)
    setButtonText("Shop Now")
    setButtonLink("/store")
    setCollectionIds([])
    setLimit(8)
  }

  const handleEdit = (sec: any) => {
    setEditingId(sec.id)
    setTitle(sec.title)
    setType(sec.type)
    setCollectionId(sec.collection_id || "none")
    setImageUrl(sec.image_url || "")
    setAnimation(sec.animation || "fade-up")
    setShowButton(sec.show_button ?? true)
    setButtonText(sec.button_text || "Shop Now")
    setButtonLink(sec.button_link || "/store")
    setCollectionIds(sec.collection_ids || [])
    setLimit(sec.limit || 8)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return
    try {
      await fetch("/admin/storefront-sections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      toast.success("Deleted successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const moveSection = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === sections.length - 1) return

    const current = sections[index]
    const swapWith = sections[direction === "up" ? index - 1 : index + 1]

    const currentSeq = current.sequence
    current.sequence = swapWith.sequence
    swapWith.sequence = currentSeq

    await fetch("/admin/storefront-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: current.id, sequence: current.sequence })
    })
    await fetch("/admin/storefront-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: swapWith.id, sequence: swapWith.sequence })
    })
    
    fetchData()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    let finalImageUrl = imageUrl

    try {
      if (file) {
        const formData = new FormData()
        formData.append("files", file)
        const uploadRes = await fetch("/admin/uploads", { method: "POST", body: formData })
        if (!uploadRes.ok) throw new Error("Failed to upload image")
        const uploadData = await uploadRes.json()
        finalImageUrl = uploadData.files[0].url
      }

      const payload: any = {
        title,
        type,
        collection_id: collectionId === "none" ? null : collectionId,
        collection_ids: collectionIds, // 🛠️ Send the array of collections
        limit: Number(limit),          // 🛠️ Send the limit
        image_url: finalImageUrl,
        animation,
        show_button: showButton,
        button_text: buttonText,
        button_link: buttonLink,
        is_active: true
      }

      if (editingId) payload.id = editingId

      const res = await fetch("/admin/storefront-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingId ? "Section updated!" : "Section created!")
        fetchData()
        resetForm()
      } else {
        toast.error("Failed to save section")
      }
    } catch (error) {
      toast.error("An error occurred while saving")
    }
    setIsSaving(false)
  }

  // 🛠️ Toggle checkbox logic
  const toggleCollection = (id: string) => {
    if (collectionIds.includes(id)) {
      setCollectionIds(collectionIds.filter(cId => cId !== id))
    } else {
      setCollectionIds([...collectionIds, id])
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <Container>
        <Heading level="h1" className="mb-6">Dynamic Page Builder</Heading>
        <div className="flex justify-between items-center mb-4">
          <Heading level="h2" className="text-ui-fg-subtle">
            {editingId ? "Edit Section" : "Add New Section"}
          </Heading>
          {editingId && <Button variant="secondary" onClick={resetForm}>Cancel Edit</Button>}
        </div>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Section Title</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Summer Sale" />
          </div>

          <div>
            <Label>Section Type</Label>
            <Select value={type} onValueChange={setType}>
              <Select.Trigger><Select.Value placeholder="Select type" /></Select.Trigger>
              <Select.Content>
                <Select.Item value="hero">Cinematic Hero (Massive Top Banner)</Select.Item>
                <Select.Item value="banner">Campaign Banner (Mid-page Banner)</Select.Item>
                <Select.Item value="split_promo">Split-Screen Promotion</Select.Item>
                <Select.Item value="product_grid">Product Grid (Links to Collection)</Select.Item>
              </Select.Content>
            </Select>
          </div>

          {/* 🛠️ CONDITIONAL RENDERING: Show Checkboxes for Product Grid, Dropdown for others */}
          {type === "product_grid" ? (
            <div className="md:col-span-2 flex flex-col gap-4 p-4 border rounded-md bg-ui-bg-subtle mt-2">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Products per Collection (Limit)</Label>
                <Input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} min={1} max={50} />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Select Collections to Display</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {collections.map(c => (
                    <div key={c.id} className="flex items-center gap-3">
                      <Checkbox 
                        id={c.id}
                        checked={collectionIds.includes(c.id)} 
                        onCheckedChange={() => toggleCollection(c.id)} 
                      />
                      <Label htmlFor={c.id} className="cursor-pointer">{c.title}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Label>Link to Collection (Optional)</Label>
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
          )}

          <div>
            <Label>Animation Style</Label>
            <Select value={animation} onValueChange={setAnimation}>
              <Select.Trigger><Select.Value placeholder="Select animation" /></Select.Trigger>
              <Select.Content>
                <Select.Item value="fade-up">Fade Up (Smooth)</Select.Item>
                <Select.Item value="fade-in">Fade In (Subtle)</Select.Item>
                <Select.Item value="slide-left">Slide from Left</Select.Item>
                <Select.Item value="slide-right">Slide from Right</Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Background Image (Upload)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1" />
            {imageUrl && !file && <p className="text-xs text-gray-500 mt-1">Current image saved.</p>}
          </div>

          <div className="md:col-span-2 flex items-center gap-2 mt-2 border-t pt-4">
            <Checkbox 
              id="showButton" 
              checked={showButton} 
              onCheckedChange={(checked) => setShowButton(!!checked)} 
            />
            <Label htmlFor="showButton" className="font-bold cursor-pointer">Show Call-to-Action Button</Label>
          </div>

          {showButton && (
            <>
              <div>
                <Label>Button Text</Label>
                <Input required value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
              </div>
              <div>
                <Label>Button Link (URL)</Label>
                <Input required value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="/store or /products/handle" />
              </div>
            </>
          )}

          <div className="md:col-span-2 flex justify-end mt-4">
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingId ? "Update Section" : "Create Section"}
            </Button>
          </div>
        </form>
      </Container>

      {/* ... Table rendering remains exactly the same ... */}
      <Container>
        <Heading level="h2" className="mb-4 text-ui-fg-subtle">Page Layout (Drag & Drop Order)</Heading>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row><Table.Cell colSpan={4} className="text-center">Loading...</Table.Cell></Table.Row>
            ) : sections.length === 0 ? (
              <Table.Row><Table.Cell colSpan={4} className="text-center">No sections built yet.</Table.Cell></Table.Row>
            ) : (
              sections.map((sec, index) => (
                <Table.Row key={sec.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <IconButton variant="transparent" size="small" onClick={() => moveSection(index, "up")} disabled={index === 0}>
                        <ArrowUpMini />
                      </IconButton>
                      <IconButton variant="transparent" size="small" onClick={() => moveSection(index, "down")} disabled={index === sections.length - 1}>
                        <ArrowDownMini />
                      </IconButton>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-bold">{sec.title}</Table.Cell>
                  <Table.Cell className="uppercase text-xs text-gray-500">{sec.type.replace("_", " ")}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton variant="transparent" onClick={() => handleEdit(sec)}>
                        <PencilSquare />
                      </IconButton>
                      <IconButton variant="transparent" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(sec.id)}>
                        <Trash />
                      </IconButton>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export default StorefrontSectionsPage

export const config = defineRouteConfig({
  label: "Page Builder",
  icon: Window,
})
