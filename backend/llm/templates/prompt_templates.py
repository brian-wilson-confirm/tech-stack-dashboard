from dotenv import load_dotenv

from backend.database.views.lesson_schemas import LessonRequest

# load the environment variables
load_dotenv()


def build_lesson_prompt(lesson: LessonRequest, categorization: dict) -> str:
    return f"""
            You are a smart system design assistant responsible for classifying a Lesson into specific Categories, Subcategories, Technologies, and Topics.

            A **Lesson** is the smallest structured unit of learning content within the platform I am building.
            It delivers a focused concept or skill, often as part of a broader Module and Course, but can also be standalone.

            A **Technology** is a practical, real-world tool, framework, or service that helps design, develop, build, manage, deploy, or secure systems.

            A **Topic** is a focused, reusable concept, skill, best practice, or architectural pattern (such as "Authentication", "Unit Testing", or "Caching") that a Lesson covers or applies. 
            Topics are more granular than subcategories and may be relevant across multiple categories, subcategories, or technologies.
                        
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
       
            ### 🛠 Available Technologies (Examples)

            Each technology has a **Category** and **Subcategory** associated with it. 
            There is no strict list of technologies, but every technology must map to 1 or more subcategories.
            Identify technologies relevant to the lesson if appropriate.
            Some examples of technologies include:
            - Python
            - JavaScript
            - React
            - Node.js
            - Express
            - MongoDB
            - PostgreSQL
            - Docker
            - Kubernetes
            - Terraform
            - Ansible
            - Cloudflare
            - Apache Kafka

            ---

            ### 📚 Available Topics

            Suggest a topic or topics if you believe it is highly relevant and applicable to the lesson. There is no strict list of topics.

            Examples of topics include but are not limited to: Authentication, Unit Testing, State Management, Error Handling, CI/CD, Container Orchestration, etc.

            ---

            ### 🎯 Task

            **Instructions:**
            - Analyze the provided information and classify the lesson appropriately:
            -- You may assign multiple subcategories to a single category if relevant.
            -- Only choose categories and subcategories from the predefined list/taxonomy.
            -- For each subcategory you assign, provide a brief one-sentence reasoning explaining why the lesson fits.
            -- Only include the most relevant categories (1–3 max). Avoid generic or overly broad reasoning.

            - If applicable, suggest one or more technologies associated with the lesson:
            -- For each technology, list which subcategories it is associated with, and provide a one-sentence justification.
            
            - If applicable, suggest one or more topics associated with the lesson:
            -- For each topic, provide a one-sentence justification explaining its relevance.
            
            - Estimate how long it would take to read or complete the lesson:
            -- If an explicit read time is mentioned (e.g., "7 min read"), use it.
            -- If no time is mentioned, estimate based on the content description.
            -- Assume an average reading speed of 150–200 words per minute for technical material.
            -- Return the estimate as an integer number of hours, unless it's less than 1 hour in which case return the number of minutes.

            ---

            ### 📤 Output Format (JSON)

            Return your response strictly in the following JSON format:
            {{
                "lesson": "<Lesson Title>",
                "estimated_duration": "<Estimated number of hours or minutes>",
                "categories": [
                    {{
                        "category": "<Selected Category>",
                        "subcategories": [
                            {{
                                "subcategory": "<Selected Subcategory>",
                                "reasoning": "<One-sentence explanation for why this lesson belongs to this subcategory>"
                            }}
                        ],
                        "reasoning": "<One-sentence explanation for why this lesson belongs to this category>"
                    }}
                ],
                "technologies": [
                    {{
                        "technology": "<Selected Technology>",
                        "subcategories": [
                           {{
                                "subcategory": "<Selected Subcategory>",
                                "reasoning": "<One-sentence explanation for why this technology is relevant to this subcategory>"
                            }}
                        ],
                        "reasoning": "<One-sentence explanation for why this lesson is related to this technology>"
                    }}
                ],
                "topics": [
                    {{
                        "topic": "<Selected Topic>",
                        "reasoning": "<One-sentence explanation for why this topic is relevant to this lesson>"
                    }}
                ]
            }}
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