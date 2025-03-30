import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { fetchTechStack } from '../api'

export default function TechStack() {
  const [stack, setStack] = useState<any[]>([]);

  const handleClick = async () => {
    const data = await fetchTechStack();
    setStack(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tech Stack Dashboard</h1>
      <Button onClick={handleClick} variant="default">
        Load Tech Stack
      </Button>
      <div className="mt-6">
        {stack.map((item) => (
          <div 
            key={item.id} 
            className="p-4 mb-2 rounded-lg bg-secondary"
          >
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 