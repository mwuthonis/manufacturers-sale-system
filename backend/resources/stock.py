from flask_restful import Resource, reqparse
from backend.models import Stock
from backend.app import db
from backend.resources.auth import role_required

class StockResource(Resource):
    @role_required(['Admin', 'Warehouse'])
    def get(self, id=None):
        if id:
            stock = Stock.query.get(id)
            if not stock:
                return {'message': 'Not found'}, 404
            return {'id': stock.id, 'item_name': stock.item_name, 'quantity': stock.quantity}
        stocks = Stock.query.all()
        return [{'id': s.id, 'item_name': s.item_name, 'quantity': s.quantity} for s in stocks]

    @role_required(['Admin', 'Warehouse'])
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('item_name', required=True)
        parser.add_argument('quantity', type=int, required=True)
        args = parser.parse_args()
        stock = Stock(item_name=args['item_name'], quantity=args['quantity'])
        db.session.add(stock)
        db.session.commit()
        return {'message': 'Stock added', 'id': stock.id}, 201

    @role_required(['Admin', 'Warehouse'])
    def put(self, id):
        stock = Stock.query.get(id)
        if not stock:
            return {'message': 'Not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('quantity', type=int)
        args = parser.parse_args()
        if args['quantity'] is not None:
            stock.quantity = args['quantity']
        db.session.commit()
        return {'message': 'Stock updated'}

    @role_required(['Admin'])
    def delete(self, id):
        stock = Stock.query.get(id)
        if not stock:
            return {'message': 'Not found'}, 404
        db.session.delete(stock)
        db.session.commit()
        return {'message': 'Stock deleted'}
