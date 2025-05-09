from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from fastapi import HTTPException
from backend.enums import ResponseType

llm = ChatOpenAI(
            model="gpt-4-turbo", 
            temperature=0.2         # The temperature parameter in OpenAI's API controls how random or creative the model's responses are.
        )

def submit_prompt(SYSTEM_PROMPT: str, USER_PROMPT: str, resp_type: ResponseType) -> str:
    try:
        SYSTEM_PROMPT += f"\nRespond only in valid {resp_type.value.upper()} format."

        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=USER_PROMPT)
        ]

        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


