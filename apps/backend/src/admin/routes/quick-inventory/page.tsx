// File: apps/backend/src/admin/routes/quick-inventory/page.tsx

import { useState, useEffect } from "react"
import { Container, Heading, Table, Button, Input, toast, Text, Badge, IconButton } from "@medusajs/ui"
import { ArchiveBox, MagnifyingGlass, PencilSquare } from "@medusajs/icons"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const QuickInventoryPage = () => {
  const [variants, setVariants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // 🛠️ NEW: Search and "Add" state
  const [searchQuery, setSearchQuery] = useState("")
  const [addQuantities, setAddQuantities] = useState<Record<string, number>>({})

  const fetchInventory = async () => {
    try {
      const res = await fetch("/admin/quick-inventory")
      const data = await res.json()
      setVariants(data.variants || [])
      
      // Reset the "Add" inputs to 0
      const initialAdd: Record<string, number> = {}
      data.variants?.forEach((v: any) => {
        initialAdd[v.variant_id] = 0
      })
      setAddQuantities(initialAdd)
    } catch (error) {
      toast.error("Failed to load inventory")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleAddChange = (id: string, value: string) => {
    setAddQuantities(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }))
  }

    const handleUpdate = async (variant: any) => {
    if (!variant.inventory_item_id) {
      toast.error("Inventory tracking is not set up for this item.")
      return
    }

    const amountToAdd = addQuantities[variant.variant_id] || 0
    if (amountToAdd === 0) {
      toast.error("Please enter an amount to add.")
      return
    }

    setUpdatingId(variant.variant_id)
    const newTotal = variant.stocked_quantity + amountToAdd

    try {
      const res = await fetch("/admin/quick-inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventory_item_id: variant.inventory_item_id,
          location_id: variant.location_id, // It's okay if this is undefined now!
          stocked_quantity: newTotal
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Added ${amountToAdd}! New total is ${newTotal}.`)
        fetchInventory() 
      } else {
        toast.error(data.error || "Failed to update stock")
      }
    } catch (error: any) {
      toast.error("An error occurred while updating")
    }
    setUpdatingId(null)
  }


  // 🛠️ NEW: Filter the list based on the search bar
  const filteredVariants = variants.filter(v => 
    v.product_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container className="p-8 max-w-5xl mx-auto flex flex-col gap-6 pb-20">
      <div>
        <Heading level="h1" className="text-2xl font-bold">📦 Quick Inventory</Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Search for a product and type the number of items that just arrived. The system will add it to your current stock automatically.
        </Text>
      </div>

      {/* 🛠️ NEW: Search Bar */}
      <div className="flex items-center gap-2 bg-ui-bg-subtle p-2 rounded-md border w-full max-w-md">
        <MagnifyingGlass className="text-ui-fg-subtle ml-2" />
        <input 
          type="text" 
          placeholder="Search by product name or SKU..." 
          className="bg-transparent border-none outline-none w-full text-sm p-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Current Stock</Table.HeaderCell>
            <Table.HeaderCell>Arrived (Add)</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row><Table.Cell colSpan={5} className="text-center py-8">Loading inventory...</Table.Cell></Table.Row>
          ) : filteredVariants.length === 0 ? (
            <Table.Row><Table.Cell colSpan={5} className="text-center py-8">No products found.</Table.Cell></Table.Row>
          ) : (
            filteredVariants.map((v) => (
              <Table.Row key={v.variant_id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.product_title} className="w-10 h-10 rounded object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-400">No img</div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold">{v.product_title}</span>
                      <span className="text-xs text-gray-500">
                        {v.variant_title !== "Default Variant" && v.variant_title !== "Standard" ? v.variant_title : ""}
                      </span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-gray-600 font-mono text-sm">{v.sku}</Table.Cell>
                <Table.Cell>
                  <span className="font-bold text-lg">{v.stocked_quantity}</span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold">+</span>
                    <Input 
                      type="number" 
                      className="w-20"
                      placeholder="0"
                      value={addQuantities[v.variant_id] || ""}
                      onChange={(e) => handleAddChange(v.variant_id, e.target.value)}
                      disabled={!v.manage_inventory || !v.inventory_item_id}
                    />
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* 🛠️ NEW: Edit Button to jump to the product settings */}
                    <a href={`/app/products/${v.product_id}`}>
                      <IconButton variant="transparent" size="small">
                        <PencilSquare />
                      </IconButton>
                    </a>
                    
                    <Button 
                      variant="secondary" 
                      size="small"
                      isLoading={updatingId === v.variant_id}
                      disabled={!v.manage_inventory || !v.inventory_item_id || !addQuantities[v.variant_id]}
                      onClick={() => handleUpdate(v)}
                    >
                      Add Stock
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export default QuickInventoryPage

export const config = defineRouteConfig({
  label: "Quick Inventory",
  icon: ArchiveBox,
})
