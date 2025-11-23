from flask_restful import Resource, reqparse
from flask import request
from models import Stock
from app import db
from resources.auth import role_required

class StockResource(Resource):
    @role_required(['Admin','Sales', 'Warehouse'])
    def get(self, id=None):
        if id:
            stock = Stock.query.get(id)
            if not stock:
                return {'message': 'Not found'}, 404
            return {
                'id': stock.id,
                'item_name': stock.item_name,
                'category': stock.category,
                'unit_price': stock.unit_price,
                'quantity': stock.quantity,
                'last_updated': stock.last_updated.isoformat() if stock.last_updated else None
            }
        stocks = Stock.query.all()
        return [
            {
                'id': s.id,
                'item_name': s.item_name,
                'category': s.category,
                'unit_price': s.unit_price,
                'quantity': s.quantity,
                'last_updated': s.last_updated.isoformat() if s.last_updated else None
            }
            for s in stocks
        ]

    @role_required(['Admin', 'Warehouse'])
    def post(self):
        # Support both single and batch creation
        data = request.get_json(force=True)
        items = data if isinstance(data, list) else [data]
        created = []
        for item in items:
            item_name = item.get('item_name')
            category = item.get('category')
            unit_price = item.get('unit_price')
            quantity = item.get('quantity')
            if not all([item_name, category, unit_price, quantity]):
                continue  # skip invalid
            stock = Stock(
                item_name=item_name,
                category=category,
                unit_price=unit_price,
                quantity=quantity
            )
            db.session.add(stock)
            db.session.flush()  # get id before commit
            created.append({
                "id": stock.id,
                "item_name": stock.item_name,
                "category": stock.category,
                "unit_price": stock.unit_price,
                "quantity": stock.quantity,
                "last_updated": stock.last_updated.isoformat() if stock.last_updated else None
            })
        db.session.commit()
        return created, 201

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
