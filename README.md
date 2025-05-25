# Pin App

A Python web application for managing and organizing pins/bookmarks.

## 🚀 Live Demo

Try the application live: **[https://pin-app-wqhh.onrender.com](https://pin-app-wqhh.onrender.com)**

## Features

- Web-based interface for pin management
- Static file serving
- Template-based UI
- Easy deployment and setup

## Project Structure

```
pin-app/
├── static/          # Static files (CSS, JS, images)
├── templates/       # HTML templates
├── venv/           # Virtual environment
├── app.py          # Main application file
├── requirements.txt # Python dependencies
└── requirements.txt.txt # Additional requirements
```

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishan-skit/pin-app.git
   cd pin-app
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Run the application**
   ```bash
   python app.py
   ```

2. **Access the application**
   Open your web browser and navigate to `http://localhost:5000` (or the port specified in the console output)

## Development

### Setting up for development

1. Follow the installation steps above
2. Make sure your virtual environment is activated
3. Install any additional development dependencies if needed

### File Structure Details

- **`app.py`**: Main Flask application with routes and logic
- **`static/`**: Contains CSS stylesheets, JavaScript files, and images
- **`templates/`**: HTML templates using Jinja2 templating engine
- **`requirements.txt`**: List of Python packages required for the project

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a new Pull Request

## License

This project is open source. Please check the repository for license details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## Deployment

### Local Deployment
Follow the installation and usage steps above.

### Production Deployment
For production deployment, consider:
- Using a WSGI server like Gunicorn
- Setting up environment variables
- Configuring a reverse proxy (nginx)
- Setting up SSL certificates

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

---

**Author**: ishan-skit  
**Repository**: [pin-app](https://github.com/ishan-skit/pin-app)
