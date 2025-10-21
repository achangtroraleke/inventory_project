from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from ..models.product_model import Product
from ..serializers.transaction_serializer import TransactionSerializer
from ..serializers.stock_serializer import StockSerializer
from django.core.exceptions import ObjectDoesNotExist
import datetime

class ProductSerializer(serializers.ModelSerializer):
    # Include current stock quantity as a read-only field
    current_stock = serializers.IntegerField(source='stock.quantity', read_only=True)
    low_stock_alert = serializers.SerializerMethodField()
    transaction_history = SerializerMethodField()
    stock_id = serializers.IntegerField(source='stock.id', read_only=True)

    def get_low_stock_alert(self, obj: 'Product') -> str:
    
        reorder_point = obj.reorder_point # Access from the Product model
    
        try:
            # Perform reverse lookup and get quantity
            quantity = obj.stock.quantity 
        except ObjectDoesNotExist:
            # If no stock record exists (quantity is 0)
            quantity = 0

        # Logic: If quantity is less than or equal to reorder_point
        if quantity <= reorder_point:
            return 'LOW'
        return 'OK'
    
        # --- CRITICAL FILTERING METHOD ---
    def get_transaction_history(self, obj: Product):
        """
        Filters the transaction history based on month/year query parameters 
        passed from the request context before serialization.
        """

        request = self.context.get('request')
        now = datetime.datetime.now() # Get current time
        # 1. Determine the target month and year, defaulting to current
        try:
            # If query params are missing, .get() defaults to now.month/now.year
            month = int(request.query_params.get('month', now.month))
            year = int(request.query_params.get('year', now.year))
        except (TypeError, ValueError):
            # Fallback if query params are malformed (e.g., ?month=abc)
            month = now.month
            year = now.year
        
        # Start with the full queryset for the current product
        transactions = obj.transactions.all() 
        
        if month and year:
            try:
                # Apply the date filter using Django ORM's date lookups
                transactions = transactions.filter(
                    timestamp__month=int(month),
                    timestamp__year=int(year)
                ).order_by('-timestamp') # Optional: Sort descending by date
            except ValueError:
                # Silently fail if month or year is not a valid integer
                pass

        # Serialize the filtered queryset using the nested serializer
        return TransactionSerializer(transactions, many=True).data
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'SKU',  'unit_price', 'reorder_point', 'current_stock','low_stock_alert','transaction_history','stock_id' ]
        depth = 2
