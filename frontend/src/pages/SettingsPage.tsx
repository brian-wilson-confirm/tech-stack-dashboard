import { useState } from "react";
import { Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CategoryResultsDialog } from "@/components/dialogs/CategoryResultsDialog";
import { AddTechnologyWidget } from "@/components/widgets/AddTechnologyWidget";

type CategoryResult = {
  course: string;
  category: string;
  reasoning: string;
}

export default function SettingsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CategoryResult[]>([]);

  const analyzeCourseCategories = async () => {
    setIsAnalyzing(true);
    try {
      // 1. Get all courses
      const coursesResponse = await fetch('/api/courses/');
      const courses = await coursesResponse.json();

      // 2. Get categories
      const categoriesResponse = await fetch('/api/tasks/categories');
      const categoriesObject = await categoriesResponse.json();
      const categories = categoriesObject.map((category: any) => category.name);

      const analysisResults: CategoryResult[] = [];

      // 3. Get detailed course info and analyze each course
      for (const course of courses) {
        try {
          // Get detailed course info
          const detailsResponse = await fetch(`/api/courses/${course.id}/details`);
          const courseDetails = await detailsResponse.json();

          // Call the analyze-course-category endpoint
          const analysisResponse = await fetch('/api/analyze-course-category', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              course_data: courseDetails,
              categories: categories
            }),
          });

          if (!analysisResponse.ok) {
            throw new Error(`Analysis failed with status: ${analysisResponse.status}`);
          }

          const analysisResult = await analysisResponse.json();
          const parsedResult = JSON.parse(analysisResult);

          analysisResults.push({
            course: courseDetails.title,
            category: parsedResult.category,
            reasoning: parsedResult.reasoning
          });
        } catch (error) {
          console.error(`Error analyzing course ${course.id}:`, error);
          toast.error(`Failed to analyze course ${course.title}`);
        }
      }

      setResults(analysisResults);
      setShowResults(true);
    } catch (error) {
      console.error('Error in course analysis:', error);
      toast.error('Failed to analyze courses');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Widget #1 */}
        <div className="border rounded-lg p-6">
          <AddTechnologyWidget />
        </div>

        {/* Widget #2 */}
        <div className="border rounded-lg p-6">
          <AddTechnologyWidget />
        </div>

        {/* Widget #3 */}
        <div className="border rounded-lg p-6">
          {[
            {
              destination: 'Course'
            },
            {
              destination: 'Module'
            },
            {
              destination: 'Lesson'
            },
            {
              destination: 'Resource'
            }
          ].map((obj) => (
            <div key={obj.destination} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{obj.destination}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={obj.destination === 'Course' ? analyzeCourseCategories : undefined}
                disabled={obj.destination === 'Course' && isAnalyzing}
              >
                {obj.destination === 'Course' && isAnalyzing ? 'Analyzing...' : 'Category'}
              </Button>
              <Button variant="outline" size="sm">Subcategory</Button>
              <Button variant="outline" size="sm">Lesson</Button>
            </div>
          ))}
        </div>


        {/* Widget #4 */} 
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Settings Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Total Trips</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Flight Hours</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-2xl font-bold">$12.5k</p>
              <p className="text-sm text-muted-foreground">Budget Used</p>
            </div>
          </div>
        </div>
      </div>
      <CategoryResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        results={results}
      />
    </div>
  );
} 