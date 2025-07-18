from openai import OpenAI
from dotenv import load_dotenv
import os

from fastapi import FastAPI, File, Form, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import base64

# Load environment variables from .env file
load_dotenv()

my_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=my_api_key)


class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str


app = FastAPI()

# CORS middleware to allow cross-origin requests. This is needed if your frontend is hosted on a different domain or port.
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # in production, we'll want to restrict this to a certain domain
    allow_credentials = True, # allows the front end to send cookies or authentication tokens with requests
    allow_methods = ["GET", "POST"],
    allow_headers = ["*"], # If your API requires special headers, like authorization for authentication, this ensures that they're accepted. 
)


@app.post("/")
def ai_prompt(request: ChatRequest):

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful software development assistant."
            },
            {
                "role": "user",
                "content": request.prompt
            }
        ]
    )
    gpt_response = completion.choices[0].message.content
    return ChatResponse(response=gpt_response)

# Endpoint to handle file uploads (copied from the FastAPI docs https://fastapi.tiangolo.com/tutorial/request-files/#uploadfile)
@app.post("/uploadfile/")
async def create_upload_file(
    prompt: str = Form(...),  # Use Form to accept a string input. (...) is used to indicate that this is a required field
    file: UploadFile = File(None)  # Use File to accept a file upload. None means it's optional.
):
    base64_image = None
    response = None
    if file:
        contents = await file.read() # waits till the file is fully read, because the funciton is async
        base64_image = base64.b64encode(contents).decode("utf-8")
        # print (f"Received file: {file.filename}, size: {len(contents)} bytes") # For debugging purposes, you can uncomment this line to see the file details
        response = client.chat.completions.create(
            model="o4-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        { "type": "text", "text": prompt },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                            },
                        },
                    ],
                }
            ],
        )
    else:
        #print("No file uploaded, using text prompt only.") # For debugging purposes, you can uncomment this line to see when no file is uploaded
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
    if (response):
        gpt_response = response.choices[0].message.content
        return ChatResponse(response=gpt_response)
    return ChatResponse(response="No response")