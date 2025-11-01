running the backend 
activate the virtual environment
in the project path:
- python -v venv venv
- source venv/Scripts/activate
set the variables 
- $env:FLASK_ENV = "development"
- $env:FLASK_APP = "backend.app"~
- $env:PYTHONPATH = "."
then 
flask run
