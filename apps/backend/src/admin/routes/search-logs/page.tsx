// File: apps/backend/src/admin/routes/search-logs/page.tsx
// --- PART 3 ---

import { useState, useEffect } from "react"
import { Container, Heading, Table, Badge } from "@medusajs/ui"
import { MagnifyingGlass } from "@medusajs/icons"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const SearchLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/admin/search-logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch logs", err)
        setIsLoading(false)
      })
  }, [])

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Search Analytics</Heading>
      </div>
      
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Raw Query</Table.HeaderCell>
            <Table.HeaderCell>AI Search Term</Table.HeaderCell>
            <Table.HeaderCell>Results Found</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-6">Loading...</Table.Cell>
            </Table.Row>
          ) : logs.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4} className="text-center py-6">No searches logged yet.</Table.Cell>
            </Table.Row>
          ) : (
            logs.map((log) => (
              <Table.Row key={log.id}>
                <Table.Cell>{new Date(log.created_at).toLocaleDateString()}</Table.Cell>
                <Table.Cell className="font-medium max-w-[200px] truncate" title={log.query}>
                  {log.query}
                </Table.Cell>
                <Table.Cell>
                  {log.search_term ? (
                    <Badge color="grey">{log.search_term}</Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {log.results_count > 0 ? (
                    <Badge color="green">{log.results_count} found</Badge>
                  ) : (
                    <Badge color="red">0 found</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export default SearchLogsPage

export const config = defineRouteConfig({
  label: "Search Analytics",
  icon: MagnifyingGlass,
})
// --- END OF CODE ---
