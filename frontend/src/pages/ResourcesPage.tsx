import { useState } from "react"
import { BookOpen } from "lucide-react"
import { DataTableWidget } from "@/components/widgets/DataTableWidget"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

interface Resource {
  id: string
  title: string
  description: string
  url: string
  resource_type: string
  source: {
    name: string
    source_type: string
  }
}

export default function ResourcesPage() {
  const [rows, setRows] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetchedRows, setHasFetchedRows] = useState(false)

  const columns: ColumnDef<Resource>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "resource_type",
      header: "Type",
    },
    {
      accessorKey: "source.name",
      header: "Source",
    },
    {
      accessorKey: "source.source_type",
      header: "Source Type",
    },
  ]

  const fetchRows = async () => {
    if (hasFetchedRows) return
    setIsLoading(true)

    try {
      const response = await fetch('/api/resources')
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      const data = await response.json()
      setRows(data)
      setHasFetchedRows(true)
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to fetch resources')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Resources</h1>
      </div>

      <DataTableWidget
        columns={columns}
        data={rows}
        isLoading={isLoading}
        fetchData={fetchRows}
        showCheckboxes={false}
        showActions={false}
      />
    </div>
  )
} 