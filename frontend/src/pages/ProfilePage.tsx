import { useState } from "react";
import { Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CategoryResultsDialog } from "@/components/dialogs/CategoryResultsDialog";
import { AddTechnologyWidget } from "@/components/widgets/AddTechnologyWidget";
import { TestingWidget } from "@/components/widgets/TestingWidget";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type CategoryResult = {
  course: string;
  category: string;
  reasoning: string;
}

export default function ProfilePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CategoryResult[]>([]);

  const analyzeCourseCategories = async () => {
    setIsAnalyzing(true);
    const analysisResults: CategoryResult[] = [];

    try {
      // Fetch all courses
      const coursesResponse = await fetch('/api/courses');
      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch courses');
      }
      const courses = await coursesResponse.json();

      // Fetch categories for analysis
      const categoriesResponse = await fetch('/api/tasks/categories');
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categoriesData = await categoriesResponse.json();
      const categories = categoriesData.map((cat: { name: string }) => cat.name);

      // Analyze each course
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

          // Handle the new response format
          if (parsedResult.courses && parsedResult.courses.length > 0) {
            const courseAnalysis = parsedResult.courses[0];
            if (courseAnalysis.categories && courseAnalysis.categories.length > 0) {
              // Add each category analysis as a separate result
              courseAnalysis.categories.forEach((categoryAnalysis: any) => {
                analysisResults.push({
                  course: courseDetails.title,
                  category: categoryAnalysis.category,
                  reasoning: categoryAnalysis.reasoning
                });
              });
            }
          }

          // Update course categories in the database
          const updateResponse = await fetch('/api/courses/categories', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ llm_response: analysisResult }) // Wrap the response in the expected format
          });

          if (!updateResponse.ok) {
            throw new Error(`Failed to update course categories: ${updateResponse.status}`);
          }

        } catch (error) {
          console.error(`Error analyzing course ${course.id}:`, error);
          toast.error(`Failed to analyze course ${course.title}`);
        }
      }

      setResults(analysisResults);
      setShowResults(true);
      toast.success('Course categories have been analyzed and updated successfully');
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
        <h2 className="text-xl font-semibold mb-4">Auto-Discover Resource Categorization</h2>
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
          <TestingWidget />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Brian Wilson" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="bwil0007@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue="Tech Dashboard" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="San Francisco, CA" />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" defaultValue="English" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="Pacific Time (PT)" />
            </div>
            <Button variant="outline" className="w-full">Update Settings</Button>
          </CardContent>
        </Card>
      </div>

      <CategoryResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        results={results}
      />
    </div>
  );
} 