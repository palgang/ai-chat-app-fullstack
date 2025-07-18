"""
Test cases for the Chat API
"""
import pytest
from fastapi.testclient import TestClient
from chatapi import app

client = TestClient(app)


def test_read_root():
    """Test the root GET endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Chat API is running"}


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
    # In testing mode, should return mock response
    assert response.json()["response"] == "Mock response for testing"


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
    # In testing mode, should return mock response
    assert response.json()["response"] == "Mock response for testing file upload"


def test_file_upload_endpoint_with_invalid_data():
    """Test the file upload endpoint with missing prompt"""
    response = client.post("/uploadfile/", data={})
    assert response.status_code == 422  # Validation error for missing required field
