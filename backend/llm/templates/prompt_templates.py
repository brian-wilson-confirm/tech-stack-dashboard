from dotenv import load_dotenv

from backend.database.views.lesson_schemas import LessonRequest

# load the environment variables
load_dotenv()


def build_lesson_prompt(lesson: LessonRequest, categorization: dict) -> str:
    return f"""
            You are a smart system design assistant responsible for classifying a Lesson into specific categories, subcategories, and technologies.
            A **Lesson** is the smallest structured unit of learning content within the platform I am building. 
            It delivers a focused concept or skill, often as part of a broader Module and Course, but can also be standalone.
            A **Technology** is a practical, real-world tool or framework that I can learn to design, develop, build, manage, deploy, or secure systems.
            
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

            Each technology has a **Category** and **Subcategory** associated with it. 
            There is no strict list of technologies, but every technology you identify must map to 1 or more subcategories. 
            Examples of technologies include:
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

            ### 🎯 Task

            Analyze the provided information and classify the lesson appropriately.

            **Instructions:**
            - You may assign multiple subcategories to a single category if relevant.
            - Only choose categories and subcategories from the predefined list/taxonomy.
            - For each subcategory you assign, provide a brief one-sentence reasoning explaining why the lesson fits.
            - Only include the most relevant categories (1–3 max). Avoid generic or overly broad reasoning.
            - If applicable, suggest one or more technologies associated with the lesson.
            - For each technology, list which subcategories it is associated with, and provide a one-sentence justification.

            ---

            ### 📤 Output Format (JSON)

            Return your response strictly in the following JSON format:
            {{
                "lesson": "<Lesson Title>",
                "categories": [
                    {{
                        "category": "<Selected Category>",
                        "subcategories": [
                            {{
                                "subcategory": "<Selected Subcategory>",
                                "reasoning": "<One-sentence explanation for why this lesson belongs to this subcategory>"
                            }},
                            ...
                        ],
                        "reasoning": "<One-sentence explanation for why this lesson belongs to this category>"
                    }},
                    ...
                ],
                "technologies": [
                    {{
                        "technology": "<Selected Technology>",
                        "subcategories": [
                           {{
                                "subcategory": "<Selected Subcategory>",
                                "reasoning": "<One-sentence explanation for why this technology is relevant to this subcategory>"
                            }},
                            ...
                        ],
                        "reasoning": "<One-sentence explanation for why this lesson is related to this technology>"
                    }},
                    ...
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