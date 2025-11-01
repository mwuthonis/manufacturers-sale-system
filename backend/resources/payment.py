from flask_restful import Resource, reqparse
from flask import request
import os
from werkzeug.utils import secure_filename
from backend.models import Payment, Invoice
from backend.app import db
from backend.resources.auth import role_required

class PaymentResource(Resource):
    @role_required(['Admin', 'Sales'])
    def get(self, id=None):
        if id:
            payment = Payment.query.get(id)
            if not payment:
                return {'message': 'Payment not found'}, 404
            
            return {
                'id': payment.id,
                'invoice_id': payment.invoice_id,
                'amount': payment.amount,
                'payment_method': getattr(payment, 'payment_method', None),
                'payment_date': payment.paid_at.isoformat() if payment.paid_at else None,
                'status': getattr(payment, 'status', 'Pending'),
                'reference': getattr(payment, 'reference', None),
                'notes': getattr(payment, 'notes', None),
                'receipt_path': getattr(payment, 'receipt_path', None),
                'customer_name': payment.invoice.order.customer_name if payment.invoice and payment.invoice.order else None
            }
        
        payments = Payment.query.all()
        payment_list = []
        
        for p in payments:
            payment_data = {
                'id': p.id,
                'invoice_id': p.invoice_id,
                'amount': p.amount,
                'payment_method': getattr(p, 'payment_method', None),
                'payment_date': p.paid_at.isoformat() if p.paid_at else None,
                'status': getattr(p, 'status', 'Pending'),
                'reference': getattr(p, 'reference', None),
                'notes': getattr(p, 'notes', None),
                'receipt_path': getattr(p, 'receipt_path', None),
                'customer_name': p.invoice.order.customer_name if p.invoice and p.invoice.order else None
            }
            payment_list.append(payment_data)
            
        return payment_list

    @role_required(['Admin', 'Sales'])
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('invoice_id', type=int, required=True)
        parser.add_argument('amount', type=float, required=True)
        parser.add_argument('payment_method', type=str, required=True)
        parser.add_argument('status', type=str, default='Pending')
        parser.add_argument('reference', type=str)
        parser.add_argument('notes', type=str)
        
        args = parser.parse_args()
        
        # Validate invoice exists
        invoice = Invoice.query.get(args['invoice_id'])
        if not invoice:
            return {'message': 'Invoice not found'}, 404
        
        payment = Payment(
            invoice_id=args['invoice_id'],
            amount=args['amount']
        )
        
        # Add additional fields if your Payment model supports them
        if hasattr(payment, 'payment_method'):
            payment.payment_method = args['payment_method']
        if hasattr(payment, 'status'):
            payment.status = args['status']
        if hasattr(payment, 'reference'):
            payment.reference = args['reference']
        if hasattr(payment, 'notes'):
            payment.notes = args['notes']
            
        db.session.add(payment)
        db.session.commit()
        
        return {
            'message': 'Payment recorded successfully',
            'id': payment.id,
            'invoice_id': payment.invoice_id,
            'amount': payment.amount
        }, 201

    @role_required(['Admin', 'Sales'])
    def put(self, id):
        payment = Payment.query.get(id)
        if not payment:
            return {'message': 'Payment not found'}, 404
            
        parser = reqparse.RequestParser()
        parser.add_argument('amount', type=float)
        parser.add_argument('payment_method', type=str)
        parser.add_argument('status', type=str)
        parser.add_argument('reference', type=str)
        parser.add_argument('notes', type=str)
        
        args = parser.parse_args()
        
        # Update fields
        if args['amount'] is not None:
            payment.amount = args['amount']
        if args['payment_method'] and hasattr(payment, 'payment_method'):
            payment.payment_method = args['payment_method']
        if args['status'] and hasattr(payment, 'status'):
            payment.status = args['status']
        if args['reference'] and hasattr(payment, 'reference'):
            payment.reference = args['reference']
        if args['notes'] and hasattr(payment, 'notes'):
            payment.notes = args['notes']
            
        db.session.commit()
        
        return {'message': 'Payment updated successfully'}

    @role_required(['Admin'])
    def delete(self, id):
        payment = Payment.query.get(id)
        if not payment:
            return {'message': 'Payment not found'}, 404
        db.session.delete(payment)
        db.session.commit()
        return {'message': 'Payment deleted successfully'}


class PaymentUploadResource(Resource):
    @role_required(['Admin', 'Sales'])
    def post(self):
        if 'file' not in request.files:
            return {'message': 'No file provided'}, 400
            
        file = request.files['file']
        payment_id = request.form.get('payment_id')
        
        if not payment_id:
            return {'message': 'Payment ID is required'}, 400
            
        if file.filename == '':
            return {'message': 'No file selected'}, 400
            
        # Validate payment exists
        payment = Payment.query.get(payment_id)
        if not payment:
            return {'message': 'Payment not found'}, 404
            
        # Validate file type and size
        allowed_extensions = {'png', 'jpg', 'jpeg', 'pdf', 'gif'}
        max_file_size = 5 * 1024 * 1024  # 5MB
        
        if file.content_length > max_file_size:
            return {'message': 'File size exceeds 5MB limit'}, 400
            
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        
        if file_extension not in allowed_extensions:
            return {'message': 'Invalid file type. Allowed: PNG, JPG, JPEG, PDF, GIF'}, 400
            
        # Create uploads directory if it doesn't exist
        upload_folder = os.path.join('backend', 'uploads', 'receipts')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Generate unique filename
        unique_filename = f"receipt_{payment_id}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Update payment record
        if hasattr(payment, 'receipt_path'):
            payment.receipt_path = file_path
        
        db.session.commit()
        
        return {
            'message': 'Receipt uploaded successfully',
            'file_path': file_path,
            'payment_id': payment_id
        }, 201
