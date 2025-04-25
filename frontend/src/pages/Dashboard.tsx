import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Code2, Server, Database, Cloud, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CategoryWidget } from "@/components/widgets/CategoryWidget"
import { SecurityWidget } from "@/components/widgets/SecurityWidget"
import { MetricsWidget } from "@/components/widgets/MetricsWidget"
import { CoverageWidget } from "@/components/widgets/CoverageWidget"
import { DataTableWidget, EditModeRenderer } from '@/components/widgets/DataTableWidget'
import { FilterFn, VisibilityState } from '@tanstack/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Task } from '@/components/data/schema'
import { getPriorityColor } from '@/styles/style'
import { capitalizeWords } from '@/lib/utils'
import { getStatusColor } from '@/styles/style'
import { PriorityEnum, StatusEnum } from '@/types/enums'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'
import { Select } from '@/components/ui/select'
import { SelectItem } from '@/components/ui/select'
import { SelectContent } from '@/components/ui/select'
import { SelectValue } from '@/components/ui/select'
import { SelectTrigger } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { TaskSheet } from '@/components/ui/task-sheet'
import { usePageTitle } from '@/hooks/usePageTitle'
import { QuickAddTaskWidget } from '@/components/widgets/QuickAddTaskWidget'



/*******************
  INITIAL VISIBLE COLUMNS
********************/
const initialVisibleColumns = {
  id: false, 
  task_id: true,
  task: true,
  technology: true,
  subcategory: true,
  category: false,
  topics: false,
  section: false,
  source: false,
  level: false,
  type: false,
  status: true,
  priority: true,
  progress: false,
  order: false,
  due_date: false,
  start_date: false,
  end_date: false,
  estimated_duration: false,
  actual_duration: false,
  done: false
}



export default function Dashboard() {
  // Set page title
  usePageTitle('Dashboard')

  /*******************
    STATE VARIABLES
  ********************/
  // Fetching Data
  const [rows, setRows] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [coverage, setCoverage] = useState<{ items: any[], overallProgress: number }>({ items: [], overallProgress: 0 })
  const [tasks, setTasks] = useState<any[]>([])

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState<VisibilityState>(initialVisibleColumns);
  
  // Table Pagination
  // Row Filter
  // Row Sorting
  // Row Selection
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedRow, setSelectedRow] = useState<Task | null>(null);  

  // Row Sheet
  const [sheetOpen, setSheetOpen] = useState(false);

  // Row Editing
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Task | null>(null);

  // Fetching Options
  const [priorityOptions, setPriorityOptions] = useState<{ name: string; id: number }[]>([]);
  const [typeOptions, setTypeOptions] = useState<{ name: string; id: number }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ name: string; id: number }[]>([]);
  const [sourceOptions, setSourceOptions] = useState<{ name: string; id: number }[]>([]);
  const [levelOptions, setLevelOptions] = useState<{ name: string; id: number }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ name: string; id: number }[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ name: string; id: number }[]>([]);
  const [technologyOptions, setTechnologyOptions] = useState<{ name: string; id: number }[]>([]);
  

  /*******************
    COLUMN DEFINITIONS
  ********************/
  const columns: ColumnDef<Task>[] = [
    { accessorKey: "task_id", header: "Task ID", minSize: 85, size: 100, maxSize: 100, cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-normal"
          onClick={() => handleRowClick(row.original)}
        >
          {row.original.task_id}
        </Button>
    )},
    { accessorKey: "task", header: "Task", minSize: 200, size: 275, maxSize: 325 },
    { accessorKey: "technology", header: "Technology", minSize: 75, size: 100, maxSize: 125 },
    { accessorKey: "subcategory", header: "Subcategory", minSize: 100, size: 175, maxSize: 175 },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "topics", header: "Topics", cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.topics.map((topic, index) => (
          <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800">
            {topic}
          </Badge>
        ))}
      </div>
    )},
    { accessorKey: "section", header: "Section" },
    { accessorKey: "source", header: "Source", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.source)}</span>
    )},
    { accessorKey: "level", header: "Level", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.level)}</span>
    )},
    { accessorKey: "type", header: "Type", cell: ({ row }) => (
        <span>{capitalizeWords(row.original.type)}</span>
    )},
    { accessorKey: "estimated_duration", header: "Est. Duration", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{row.original.estimated_duration}h</span>
      </div>
    )},
    { accessorKey: "actual_duration", header: "Actual Duration", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{row.original.actual_duration}h</span>
      </div>
    )},
    { accessorKey: "status", header: "Status", minSize: 85, size: 100, maxSize: 100,
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }) as FilterFn<Task>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getStatusColor(row.original.status as StatusEnum)} text-white`}>
          {capitalizeWords(row.original.status.replace('_', ' '))}
        </Badge>
      )
    },
    { accessorKey: "priority", header: "Priority", minSize: 85, size: 100, maxSize: 100,
      filterFn: ((row, columnId, filterValue) => {
        return filterValue.includes(row.getValue(columnId))
      }) as FilterFn<Task>,
      cell: ({ row }) => (
        <Badge variant="secondary" className={`${getPriorityColor(row.original.priority as PriorityEnum)} text-white`}>
          {capitalizeWords(row.original.priority)}
        </Badge>
      )
    },
    { accessorKey: "progress", header: "Progress", cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={row.original.progress} className="w-[60px]" />
        <span className="text-sm">{row.original.progress}%</span>
      </div>
    )},
    { accessorKey: "order", header: "Order" },
    { accessorKey: "due_date", header: "Due Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.due_date)}</span>
    }}, 
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.start_date)}</span>
    }},
    { accessorKey: "end_date", header: "End Date", cell: ({ row }) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      }
      return <span>{toLocalInputDate(row.original.end_date)}</span>
    }},
  ]



  /*******************
    COLUMN VISIBILITY 
  ********************/
  const columnOptions = columns.map(column => ({
    accessorKey: (column as any).accessorKey,
    header: typeof column.header === 'string' ? column.header : 'Column'
  }))



  /***********************
    PAGE LOAD
  ***********************/
  // Fetch data from individual pages
  const fetchCategoryData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch tasks separately to ensure proper data structure
      const tasksResponse = await fetch('/api/tasks')
      const tasksData = await tasksResponse.json()
      console.log('Tasks API Response:', tasksData) // Debug log
      setTasks(tasksData || []) // Remove .tasks property access

      // These would be actual API calls to your backend
      const [languages, backend, storage, devops, coverage] = await Promise.all([
        fetch('/api/tech/languages').then(res => res.json()),
        fetch('/api/tech/backend').then(res => res.json()),
        fetch('/api/tech/storage').then(res => res.json()),
        fetch('/api/tech/devops').then(res => res.json()),
        fetch('/api/coverage').then(res => res.json())
      ])

      setCategories([
        {
          name: "Languages & Frameworks",
          icon: Code2,
          stats: languages.stats,
          recentUpdates: languages.updates
        },
        {
          name: "Backend Services",
          icon: Server,
          stats: backend.stats,
          recentUpdates: backend.updates
        },
        {
          name: "Data Storage",
          icon: Database,
          stats: storage.stats,
          recentUpdates: storage.updates
        },
        {
          name: "DevOps & Cloud",
          icon: Cloud,
          stats: devops.stats,
          recentUpdates: devops.updates
        }
      ])

      setCoverage(coverage)

      // Fetch security data
      const security = await fetch('/api/security/alerts').then(res => res.json())
      setSecurityAlerts(security.alerts)

      // Fetch metrics data
      const systemMetrics = await fetch('/api/metrics').then(res => res.json())
      setMetrics(systemMetrics.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchCategoryData()
  }, [])


  // Add debug effect
  useEffect(() => {
    console.log('Current tasks state:', tasks)
  }, [tasks])



  /*******************
    ADDITIONAL FUNCTIONS
  ********************/
  // Add a function to fetch subcategories for a specific category
  const fetchSubcategoryOptionsForCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/tasks/subcategories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategory options');
      }
      const data = await response.json();
      setSubcategoryOptions(data);
      return data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories for the selected category.",
        variant: "destructive",
      });
    }
  };


  // Add a function to fetch technologies for a specific subcategory
  const fetchTechnologyOptionsForSubcategory = async (subcategoryId: string) => {
    try {
      const response = await fetch(`/api/tasks/technologies/${subcategoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch technologies');
      }
      const data = await response.json();
      setTechnologyOptions(data);
      return data;
    } catch (error) {
      console.error('Error fetching technologies:', error);
      toast({
        title: "Error",
        description: "Failed to load technologies for the selected subcategory.",
        variant: "destructive",
      });
    }
  };



  /***********************
    ROW EDITING
  ***********************/
  // Start Editing
  const startEditing = async (task: Task) => {
    try {
      // Fetch all dynamic data in parallel
      const [
        prioritiesRes,
        statusesRes,
        typesRes,
        levelsRes,
        sourcesRes,
        categoriesRes
      ] = await Promise.all([
        fetch('/api/tasks/priorities'),
        fetch('/api/tasks/statuses'),
        fetch('/api/tasks/types'),
        fetch('/api/tasks/levels'),
        fetch('/api/tasks/sources'),
        fetch('/api/tasks/categories')
      ])

      if (!prioritiesRes.ok || !statusesRes.ok || !typesRes.ok || !levelsRes.ok || !sourcesRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch some options')
      }
      
      // Dropdown Options
      const [
        priorityOptions,
        statusOptions,
        typeOptions,
        levelOptions,
        sourceOptions,
        categoryOptions
      ] = await Promise.all([
        prioritiesRes.json(),
        statusesRes.json(),
        typesRes.json(),
        levelsRes.json(),
        sourcesRes.json(),
        categoriesRes.json()
      ])

      // Set the options globally
      setPriorityOptions(priorityOptions)
      setStatusOptions(statusOptions)
      setTypeOptions(typeOptions)
      setLevelOptions(levelOptions)
      setSourceOptions(sourceOptions)
      setCategoryOptions(categoryOptions)

      
      // Find all IDs that match the task's current values
      const priorityId = priorityOptions.find((p: { id: number; name: string }) => p.name === task.priority)?.id.toString()
      const statusId = statusOptions.find((s: { id: number; name: string }) => s.name === task.status)?.id.toString()
      const typeId = typeOptions.find((t: { id: number; name: string }) => t.name === task.type)?.id.toString()
      const levelId = levelOptions.find((l: { id: number; name: string }) => l.name === task.level)?.id.toString()
      const sourceId = sourceOptions.find((s: { id: number; name: string }) => s.name === task.source)?.id.toString()
      const categoryId = categoryOptions.find((c: { id: number; name: string }) => c.name === task.category)?.id.toString()


      setEditingRow(task.id)
      
      // Set initial form state without subcategory and technology
      const initialEditForm = { 
        ...task,
        priority: priorityId || task.priority,
        status: statusId || task.status,
        type: typeId || task.type,
        level: levelId || task.level,
        source: sourceId || task.source,
        category: categoryId || task.category
      };


      setEditForm(initialEditForm);

      // Fetch subcategories based on the task's category
      if (categoryId) {
        const fetchedSubcategoryOptions = await fetchSubcategoryOptionsForCategory(categoryId);
        setSubcategoryOptions(fetchedSubcategoryOptions);

        const subcategoryId = fetchedSubcategoryOptions.find((s: { id: number; name: string }) => 
          s.name === task.subcategory
        )?.id.toString();
          
        if (subcategoryId) {
          // Update form with subcategory
          setEditForm({
            ...initialEditForm,
            subcategory: subcategoryId
          });
            
          // Now fetch technologies based on the subcategory
          const fetchedTechOptions = await fetchTechnologyOptionsForSubcategory(subcategoryId);
          setTechnologyOptions(fetchedTechOptions);
            
          // Once technologies are loaded, find the matching technology ID
          const technologyId = fetchedTechOptions.find((t: { id: number; name: string }) => 
            t.name === task.technology
          )?.id.toString();
              
          if (technologyId) {
            // Finally update the form with technology
            setEditForm({
              ...initialEditForm,
              subcategory: subcategoryId,
              technology: technologyId
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching options:', error)
      toast({
        title: "Error",
        description: "Failed to load some options. Some fields may be unavailable.",
        variant: "destructive",
      })
    }
  }


  // Edit Change
  const onEditChange = (field: keyof Task, value: Task[keyof Task]) => {
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev)
  }


  // Update handleEditChange to fetch technologies when subcategory changes
  const handleEditChange = (field: keyof Task, value: string | number | boolean | string[] | Date | null) => {
    if (editForm) {
      let processedValue: any = value;
      
      // Handle numeric fields
      if (['order', 'progress', 'estimated_duration'].includes(field)) {
        processedValue = Number(value);
      }
      
      // Handle array fields
      if (field === 'topics' && typeof value === 'string') {
        processedValue = value.split(',').map(t => t.trim());
      }
      
      // Handle boolean fields
      if (field === 'done') {
        processedValue = Boolean(value);
      }

      // Handle date fields
      if (['start_date', 'end_date'].includes(field)) {
        processedValue = value instanceof Date ? value : null;
      }
      
      // When category changes, fetch related subcategories
      if (field === 'category' && typeof value === 'string') {
        fetchSubcategoryOptionsForCategory(value);
        
        // Reset subcategory and technology when category changes
        setEditForm({ 
          ...editForm, 
          [field]: processedValue,
          subcategory: "",
          technology: ""
        });
        return;
      }
      
      // When subcategory changes, fetch related technologies
      if (field === 'subcategory' && typeof value === 'string') {
        fetchTechnologyOptionsForSubcategory(value);
        
        // Reset technology when subcategory changes
        setEditForm({ 
          ...editForm, 
          [field]: processedValue,
          technology: ""
        });
        return;
      }
      
      setEditForm({ ...editForm, [field]: processedValue });
    }
  };


  // Save Edit
  const onSaveEdit = async () => {
    if (editForm) {
      await handleRowUpdate(editForm)
    }
  }


  // Update Row
  const handleRowUpdate = async (updatedRow: Task) => {
    setIsLoading(true);

    // Destructure all dropdown fields out and rename remaining fields
    const { priority, status, type, level, source, category, subcategory, technology, ...rest } = updatedRow;
    const payload = {
      ...rest,
      priority_id: priority,
      status_id: status,
      type_id: type,
      level_id: level,
      source_id: source,
      category_id: category,
      subcategory_id: subcategory,
      technology_id: technology,
    };

    try {
      const response = await fetch(`/api/tasks/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const data = await response.json();
      setRows(rows.map(row => row.id === data.id ? data : row));
      setEditingRow(null);
      setEditForm(null);

      toast({
        title: "Task Updated",
        description: "The task has been successfully updated.",
        duration: 3000,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Cancel Edit
  const onCancelEdit = () => {
    setEditingRow(null)
    setEditForm(null)
  }


  // Delete Row
  const handleRowDelete = async (rowId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${rowId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setRows(rows.filter(row => row.id !== rowId));
      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
        duration: 3000,
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };




  /***********************
    ROW INTERACTION
  ***********************/
  const handleRowClick = useCallback((row: Task) => {
    if (editingRow) return // Don't open sheet while editing
    setSelectedRow(row)
    setSheetOpen(true)
  }, [editingRow])
  


  /*******************
    RENDER CELLS IN EDIT-MODE
  ********************/
  const editModeRenderers: EditModeRenderer<Task> = {
    technology: (value, onChange) => (
      <Select
        value={ technologyOptions.find((t) => t.name === value || t.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {technologyOptions.map(technology => (
            <SelectItem key={technology.id} value={technology.id.toString()}>{technology.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    subcategory: (value) => (
      <Select
        value={ subcategoryOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(value) => handleEditChange('subcategory', value)}
        //onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>  
        <SelectContent>
          {subcategoryOptions.map(subcategory => (
            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>{subcategory.name}</SelectItem>
          ))}
          </SelectContent>
      </Select>
    ),
    category: (value) => (
      <Select
        value={ categoryOptions.find((c) => c.name === value || c.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(value) => handleEditChange('category', value)}
        //onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map(category => (
            <SelectItem key={category.id} value={category.id.toString()}>{capitalizeWords(category.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    source: (value, onChange) => (  
      <Select
        value={ sourceOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {sourceOptions.map(source => (
            <SelectItem key={source.id} value={source.id.toString()}>{capitalizeWords(source.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    level: (value, onChange) => (
      <Select
        value={ levelOptions.find((l) => l.name === value || l.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {levelOptions.map(level => (
            <SelectItem key={level.id} value={level.id.toString()}>{capitalizeWords(level.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    type: (value, onChange) => (
      <Select
        value={ typeOptions.find((t) => t.name === value || t.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>  
        <SelectContent>
          {typeOptions.map(type => (
            <SelectItem key={type.id} value={type.id.toString()}>{capitalizeWords(type.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    status: (value, onChange) => (
      <Select
        value={ statusOptions.find((s) => s.name === value || s.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(status => (
            <SelectItem key={status.id} value={status.id.toString()}>{capitalizeWords(status.name.replace('_', ' '))}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    priority: (value, onChange) => (
      <Select
        value={ priorityOptions.find((p) => p.name === value || p.id.toString() === value?.toString())?.id.toString() ?? "" }
        onValueChange={(selectedId) => { onChange(Number(selectedId)); }}
      >
        <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map(priority => (
            <SelectItem key={priority.id} value={String(priority.id)}>{capitalizeWords(priority.name)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    progress: (value, onChange) => (
      <Input
        type="number"
        min="0"
        max="100"
        value={typeof value === 'number' ? value : 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-[70px]"
      />  
    ),
    due_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
        <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    }, 
    start_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
        <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    },
    end_date: (value, onChange) => {
      const toLocalInputDate = (date: Date | string | null) => {
        if (!date) return '';
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toISOString().split('T')[0]; // Return the date part directly
      };
    
      const fromLocalInputDate = (dateStr: string) => dateStr; // already in YYYY-MM-DD  
      const typedValue = value as string | Date | null;
    
      return (
        <Input
          type="date"
          value={toLocalInputDate(typedValue)}
          onChange={(e) => onChange(fromLocalInputDate(e.target.value))}
          className="w-[130px]"
        />
      );
    }
  }



  return (
    <div className="p-8">   
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tech Stack Dashboard</h1>
        <Button 
          onClick={fetchCategoryData}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Category Widgets: Language, Backend, Data Storage, and DevOps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((category) => (
          <CategoryWidget
            key={category.name}
            name={category.name}
            icon={category.icon}
            stats={category.stats}
            recentUpdates={category.recentUpdates}
          />
        ))}
      </div>

      {/* Today's Tasks and Quick Add Task side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 mb-8">
        <div>
          <DataTableWidget
            title="Today's Tasks"
            data={tasks}
            isLoading={isLoading}
            columns={columns}
            columnOptions={columnOptions}
            visibleColumns={visibleColumns}
            columnFilters={undefined}
            onColumnVisibilityChange={setVisibleColumns}
            onColumnFiltersChange={undefined}
            pagination={undefined}
            onPaginationChange={undefined}
            filterConfigs={undefined}
            searchQuery={undefined}
            setSearchQuery={undefined}
            sortConfigs={undefined}
            onSortChange={undefined}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            editForm={editForm}
            editModeRenderers={editModeRenderers}
            nonEditableColumns={['task_id']}
            onStartEdit={startEditing}
            onEditChange={onEditChange}
            editingRow={editingRow}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDeleteRow={handleRowDelete}
            showCheckboxes={false}
            showActions={true}
            showPagination={false}
            AddItemDialog={undefined}
            onAddItem={undefined}
          />

          <TaskSheet
            task={selectedRow}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          />
        </div>
        <QuickAddTaskWidget />
      </div>

      {/* Coverage Widget */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <CoverageWidget 
          items={coverage.items}
          overallProgress={coverage.overallProgress}
        />
      </div>

      {/* Security and System Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SecurityWidget 
          alerts={securityAlerts} 
        />
        <MetricsWidget 
          metrics={metrics} 
        />
      </div>

      {/* Task Distribution Bar Chart (by category) */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        Task Distribution Bar Chart (by category)
        Task Distribution Bar/Pie Chart (by priority)
      </div>
    </div>
  )
} 