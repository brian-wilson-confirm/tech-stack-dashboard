from dotenv import load_dotenv

from backend.database.views.lesson_schemas import LessonRequest

# load the environment variables
load_dotenv()


def build_lesson_prompt(lesson: LessonRequest, categorization: dict) -> str:
    return f"""
            You are a smart system design assistant responsible for classifying a lesson into specific categories and subcategories.
            A **Lesson** is the smallest structured unit of learning content within the platform I am building. 
            It delivers a focused concept or skill, often as part of a broader Module and Course, but can also be standalone.

            ---

            ### 📘 Lesson Details

            - **Lesson Title**: {lesson.title}
            - **Lesson Description**: {lesson.description}
            - **Resource Title**: {lesson.resource.title}
            - **Resource Description**: {lesson.resource.description}
            - **Resource Type**: {lesson.resource.resourcetype.name}
            - **Source Name**: {lesson.resource.source.name}
            - **Source Type**: {lesson.resource.source.sourcetype.name}
            
            ---

            ### 📚 Taxonomy

            Use the following predefined taxonomy when making your selections.
            Each taxonomy entry includes a **Category** and one or more associated **Subcategories**.
            You must only select from this list — do not invent new ones:
            {categorization}

            ---

            ### 🎯 Task

            Analyze the provided information and classify the lesson appropriately.

            **Instructions:**
            - You may assign multiple subcategories to a single category if relevant.
            - Only choose categories and subcategories from the predefined list/taxonomy.
            - For each subcategory you assign, provide a brief one-sentence reasoning explaining why it fits.
            - Only include the most relevant categories (1–3 max). Avoid generic or overly broad reasoning.

            ---

            ### 📤 Output Format (JSON)

            Return your response strictly in the following JSON format:

            ```json
            {{
                "lesson": "<Lesson Title>",
                "categories": [
                    {{
                        "category": "<Selected Category>",
                        "subcategories": [
                            {{
                                "subcategory": "<Selected Subcategory>",
                                "reasoning": "<One-sentence explanation specific to this selection>"
                            }},
                            ...
                        ]
                    }},
                    ...
                ]
            }}
            ```
        """





"""
OLD CODE - DELETE
"""

# Generate prompt to classify resource
def build_prompt(course_title, course_description, resource_title, resource_description, resourcetype, source_name, sourcetype, object_type, options):
    return f"""
            You are an assistant that classifies resources into 1 or more of the following predefined tech learning {object_type}.

            CATEGORIES:
            {', '.join(options)}

            Resource:
            Course Title: {course_title}
            Course Description: {course_description}
            Resource Title: {resource_title}
            Resource Description: {resource_description}
            Resource Type: {resourcetype}
            Source Name: {source_name}
            Source Type: {sourcetype}

            Return your answer in this JSON format:
            {
                [{
                    "course": "<CourseTitle>",
                    "category": "<CategoryName>",
                    "reasoning": "<One sentence explanation>"
                }]
            }
            """

"""
def classify_resource(resource: ResourceRequest):
    prompt = build_prompt(resource.title, resource.description)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[
                {"role": "system", "content": "You are a technical classifier."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=300
        )
        result = response.choices[0].message.content.strip()
        return {"classification": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""