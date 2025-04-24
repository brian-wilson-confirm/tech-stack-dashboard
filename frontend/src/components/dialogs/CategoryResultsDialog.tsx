import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

type CategoryResult = {
  course: string;
  category: string;
  reasoning: string;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: CategoryResult[];
}

export function CategoryResultsDialog({ open, onOpenChange, results }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Course Category Analysis Results</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{result.course}</h3>
                <div className="mt-2">
                  <span className="font-medium">Suggested Category:</span>
                  <span className="ml-2 bg-primary/10 text-primary px-2 py-1 rounded">
                    {result.category}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground">{result.reasoning}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 