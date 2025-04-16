import { Network } from "lucide-react"
import { DataTableWidget } from "@/components/widgets/DataTableWidget";
import { ColumnDef, OnChangeFn, PaginationState, VisibilityState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Technology } from "@/components/data/schema";

const initialVisibleColumns = {
  id: false,
  name: true,
  description: true,
}

export default function APIGatewayPage() {
  const [rows, setRows] = useState<Technology[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedRows, setHasFetchedRows] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<VisibilityState>(initialVisibleColumns);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns: ColumnDef<Technology>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Technology", minSize: 150, size: 200, maxSize: 250 },
    { accessorKey: "description", header: "Description", minSize: 600, size: 700, maxSize: 800 },
  ]

  const columnOptions = columns.map(column => ({
    accessorKey: (column as any).accessorKey,
    header: typeof column.header === 'string' ? column.header : 'Column'
  }))

  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const subcategoryName = "Gateway";
      const response = await fetch('/api/tasks/technologies/by-subcategory-name/' + subcategoryName);
      if (!response.ok) {
        throw new Error('Failed to fetch API gateways');
      }
      const data = await response.json();
      setRows(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load API gateways.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRows) {
      fetchRows();
      setHasFetchedRows(true);
    }
  }, []);

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((prev) => {
      const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;
      if (prev.pageIndex === next.pageIndex && prev.pageSize === next.pageSize) {
        return prev;
      }
      return next;
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Network className="h-8 w-8" />
        <h1 className="text-3xl font-bold">API Gateways</h1>
      </div>

      <div className="grid gap-6">
        <DataTableWidget
          data={rows}
          isLoading={isLoading}
          columns={columns}
          columnOptions={columnOptions}
          visibleColumns={visibleColumns}
          columnFilters={undefined}
          onColumnVisibilityChange={setVisibleColumns}
          onColumnFiltersChange={undefined}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          filterConfigs={undefined}
          searchQuery={undefined}
          setSearchQuery={undefined}
          sortConfigs={undefined}
          onSortChange={undefined}
          rowSelection={undefined}
          onRowSelectionChange={undefined}
          editForm={null}
          editModeRenderers={undefined}
          nonEditableColumns={undefined}
          onStartEdit={undefined}
          onEditChange={undefined}
          editingRow={null}
          onSaveEdit={undefined}
          onCancelEdit={undefined}
          onDeleteRow={undefined}         
          showCheckboxes={false}
          showActions={false}
          tableClassName="divide-x divide-y divide-border"
        />
      </div>
    </div>
  )
} 