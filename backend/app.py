from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_migrate import Migrate 
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    db_url = os.environ.get('DATABASE_URL')
    if db_url:
        # Railway provides DATABASE_URL for PostgreSQL, but SQLAlchemy expects 'postgresql://' not 'postgres://'
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    else:
        basedir = os.path.abspath(os.path.dirname(__file__))  # This gets the backend folder path
        database_path = os.path.join(basedir, 'instances', 'manufacture.db')
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    api = Api(app)
    migrate = Migrate(app, db)  # Correct initialization

    # Import and add resources here
    from backend.resources.auth import LoginResource, LogoutResource, SignupResource, ForgotPasswordResource, ResetPasswordResource
    from backend.resources.stock import StockResource
    from backend.resources.order import OrderResource
    from backend.resources.invoice import InvoiceResource
    from backend.resources.payment import PaymentResource, PaymentUploadResource
    from backend.resources.receipt import ReceiptResource
    from backend.resources.delivery_note import DeliveryNoteResource

    api.add_resource(LoginResource, '/auth/login')
    api.add_resource(LogoutResource, '/auth/logout')
    api.add_resource(SignupResource, '/auth/signup')
    api.add_resource(ForgotPasswordResource, '/auth/forgot-password')
    api.add_resource(ResetPasswordResource, '/auth/reset-password')
    api.add_resource(StockResource, '/stock', '/stock/<int:id>')
    api.add_resource(OrderResource, '/orders', '/orders/<int:id>')
    api.add_resource(InvoiceResource, '/invoices', '/invoices/<int:id>')
    api.add_resource(PaymentResource, '/api/payments', '/api/payments/<int:id>')
    api.add_resource(PaymentUploadResource, '/api/payments/upload')
    api.add_resource(ReceiptResource, '/receipts', '/receipts/<int:id>')
    api.add_resource(DeliveryNoteResource, '/delivery-notes', '/delivery-notes/<int:id>')

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        from backend.models import User, Stock, Order, Invoice, Payment, Receipt, DeliveryNote
        # Create all tables
        db.init_app(app)
        db.create_all()
    app.run(debug=True)