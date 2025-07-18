# AI Chat App - Full Stack

A full-stack AI chat application built with FastAPI (Python) backend and Next.js (React) frontend.

## 🚀 Features

- Real-time chat interface
- FastAPI backend with automatic API documentation
- React/Next.js frontend with modern UI
- CORS middleware for cross-origin requests
- RESTful API architecture

## 🛠️ Tech Stack

**Backend:**
- Python 3.12+
- FastAPI
- Uvicorn (ASGI server)

**Frontend:**
- React 18
- Next.js 14
- CSS Modules
- JavaScript (ES6+)

## 📦 Installation & Setup

### Prerequisites

- Python 3.12 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend_python/
```

2. Create and activate a virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the development server:
```bash
fastapi dev chatapi.py
```

5. For production:
```bash
uvicorn chatapi:app --host=0.0.0.0 --port=8000
```

**Backend URLs:**
- API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend_react/
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

**Frontend URL:**
- Application: [http://localhost:3000](http://localhost:3000)


## 🔧 Development Notes

### CORS Middleware

The backend includes CORS middleware to allow the frontend to make requests across different ports:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # in production, restrict to specific domains
    allow_credentials = True,
    allow_methods = ["GET", "POST"],
    allow_headers = ["*"],
)
```

### Project Structure

```
ai-chat-app-fullstack/
├── backend_python/          # FastAPI backend
│   ├── chatapi.py          # Main API application
│   ├── requirements.txt    # Python dependencies
│   └── .venv/             # Virtual environment (ignored by git)
├── frontend_react/         # Next.js frontend
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   ├── styles/           # CSS styles
│   └── package.json      # Node.js dependencies
└── README.md             # This file
```

## 🚀 Deployment

### Backend Deployment
- Use `uvicorn chatapi:app --host=0.0.0.0 --port=8000` for production
- Consider using Docker for containerization
- Set up proper environment variables for production

### Frontend Deployment
- Build the production version with `npm run build`
- Deploy to platforms like Vercel, Netlify, or AWS
- Update CORS settings in backend for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🛟 Support

If you encounter any issues or have questions, please open an issue on GitHub.
