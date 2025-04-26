from dotenv import load_dotenv

# load the environment variables
load_dotenv()


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