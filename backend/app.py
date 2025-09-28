from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_migrate import Migrate  # Fix import
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///manufacture.db'
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
    from backend.resources.payment import PaymentResource
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
    api.add_resource(PaymentResource, '/payments', '/payments/<int:id>')
    api.add_resource(ReceiptResource, '/receipts', '/receipts/<int:id>')
    api.add_resource(DeliveryNoteResource, '/delivery-notes', '/delivery-notes/<int:id>')

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        from backend.models import User, Stock, Order, Invoice, Payment, Receipt, DeliveryNote
        # Create all tables
        db.create_all()
    app.run(debug=True)