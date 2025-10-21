from rest_framework import serializers
from ..models.stock_model import Stock

class StockSerializer(serializers.ModelSerializer):
    # Display the product name instead of just the FK ID
    product_name = serializers.CharField(source='product.name', read_only=True)
    SKU = serializers.CharField(source='product.SKU', read_only=True)
    # Field to pull related Product Reorder Point
    reorder_point = serializers.IntegerField(source='product.reorder_point', read_only=True)

    low_stock_alert = serializers.SerializerMethodField()
    def get_low_stock_alert(self, obj: Stock) -> str:
        """
        Calculates the stock alert status by comparing current quantity to the reorder point.
        """
        reorder_point = obj.product.reorder_point
        if obj.quantity <= reorder_point:
            return 'LOW'
        return 'OK'
    
    class Meta:
        model = Stock
        fields = ['id', 'product', 'product_name', 'location', 'quantity', 'last_updated', 'low_stock_alert', 'reorder_point','SKU']
        read_only_fields = ['quantity', 'last_updated'] # Stock quantity is managed via Transactions
