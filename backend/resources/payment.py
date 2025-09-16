from flask_restful import Resource, reqparse
from backend.models import Payment, Invoice
from backend.app import db
from backend.resources.auth import role_required

class PaymentResource(Resource):
    @role_required(['Admin', 'Sales'])
    def get(self, id=None):
        if id:
            payment = Payment.query.get(id)
            if not payment:
                return {'message': 'Not found'}, 404
            return {'id': payment.id, 'invoice_id': payment.invoice_id, 'amount': payment.amount}
        payments = Payment.query.all()
        return [{'id': p.id, 'invoice_id': p.invoice_id, 'amount': p.amount} for p in payments]

    @role_required(['Admin', 'Sales'])
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('invoice_id', type=int, required=True)
        parser.add_argument('amount', type=float, required=True)
        args = parser.parse_args()
        payment = Payment(invoice_id=args['invoice_id'], amount=args['amount'])
        db.session.add(payment)
        db.session.commit()
        return {'message': 'Payment recorded', 'id': payment.id}, 201

    @role_required(['Admin'])
    def delete(self, id):
        payment = Payment.query.get(id)
        if not payment:
            return {'message': 'Not found'}, 404
        db.session.delete(payment)
        db.session.commit()
        return {'message': 'Payment deleted'}
