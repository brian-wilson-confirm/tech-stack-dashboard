import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
}

interface Subcategory {
  id: number
  name: string
}

export function AddTechnologyWidget() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [technologyName, setTechnologyName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tasks/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      }
    }

    fetchCategories()
  }, [toast])

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([])
        setSelectedSubcategory(null)
        return
      }

      try {
        const response = await fetch(`http://localhost:8000/api/tasks/subcategories/${selectedCategory.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories")
        }
        const data = await response.json()
        setSubcategories(data)
      } catch (error) {
        console.error("Error fetching subcategories:", error)
        toast({
          title: "Error",
          description: "Failed to load subcategories",
          variant: "destructive",
        })
      }
    }

    fetchSubcategories()
  }, [selectedCategory, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/tasks/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: technologyName,
          subcategory_id: selectedSubcategory?.id,
        }),
      })

      if (response.status === 409) {
        const data = await response.json()
        toast({
          title: "Warning",
          description: data.detail,
          variant: "default",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to add technology")
      }

      toast({
        title: "Success",
        description: `"${technologyName}" added successfully`,
      })

      // Reset form
      setTechnologyName("")
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    } catch (error) {
      console.error("Error adding technology:", error)
      toast({
        title: "Error",
        description: "Failed to add technology",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="technology" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="technology">Technology</TabsTrigger>
        <TabsTrigger value="subcategory">Subcategory</TabsTrigger>
      </TabsList>
      <TabsContent value="technology">
        <Card>
          <CardHeader>
            <CardTitle>Technology</CardTitle>
            <CardDescription>
              Add a new technology here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="technology">Technology Name</Label>
              <Input
                id="technology"
                value={technologyName}
                onChange={(e) => setTechnologyName(e.target.value)}
                placeholder="Enter technology name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Popover open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={subcategoryOpen}
                    className="w-full justify-between"
                    disabled={!selectedCategory}
                  >
                    {selectedSubcategory ? selectedSubcategory.name : "Select subcategory..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search subcategory..." />
                    <CommandEmpty>No subcategory found.</CommandEmpty>
                    <CommandGroup>
                      {subcategories.map((subcategory) => (
                        <CommandItem
                          key={subcategory.id}
                          value={subcategory.name}
                          onSelect={() => {
                            setSelectedSubcategory(subcategory)
                            setSubcategoryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSubcategory?.id === subcategory.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {subcategory.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                  >
                    {selectedCategory ? selectedCategory.name : "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            setSelectedCategory(category)
                            setCategoryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory?.id === category.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedCategory || !selectedSubcategory || !technologyName} 
              onClick={handleSubmit}
            >
              {isLoading ? "Adding..." : "Add Technology"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="subcategory">
        <Card>
          <CardHeader>
            <CardTitle>Subcategory</CardTitle>
            <CardDescription>
              Add a new subcategory here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}