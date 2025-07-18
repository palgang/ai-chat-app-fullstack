"""
Test cases for the Chat API
"""
import pytest
from fastapi.testclient import TestClient
from chatapi import app

client = TestClient(app)


def test_docs_endpoint():
    """Test that the docs endpoint is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_json():
    """Test that the OpenAPI JSON is accessible"""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"


def test_chat_endpoint():
    """Test the chat endpoint"""
    response = client.post("/", json={"prompt": "Hello, this is a test"})
    assert response.status_code == 200
    assert "response" in response.json()


def test_chat_endpoint_empty_prompt():
    """Test the chat endpoint with empty prompt"""
    response = client.post("/", json={"prompt": ""})
    assert response.status_code == 200
    assert "response" in response.json()


def test_file_upload_endpoint():
    """Test the file upload endpoint without file"""
    response = client.post("/uploadfile/", data={"prompt": "Describe this image"})
    assert response.status_code == 200
    assert "response" in response.json()


# Add more specific tests based on your actual API endpoints
# def test_file_upload_with_image():
#     """Test file upload with actual image file"""
#     with open("test_image.jpg", "rb") as f:
#         response = client.post(
#             "/uploadfile/",
#             data={"prompt": "What's in this image?"},
#             files={"file": ("test.jpg", f, "image/jpeg")}
#         )
#         assert response.status_code == 200
#         assert "response" in response.json()
