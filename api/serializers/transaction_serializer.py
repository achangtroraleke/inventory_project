from rest_framework import serializers
from django.db.models import F
from ..models import Transaction, Stock 

class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    
    
    # CRITICAL: Include 'price' so we can save the snapshot price
    class Meta:
        model = Transaction
        # Added 'price' to the fields list
        fields = ['id', 'product', 'product_name', 'type', 'quantity_change', 'timestamp', 'user', 'user_email', 'price']
        read_only_fields = ['user', 'timestamp', 'price'] # Price is set by the backend, not the user
        
    def validate(self, data):
        """
        Performs stock validation and ensures quantity signs are correct based on type.
        """
        transaction_type = data.get('type')
        quantity = data.get('quantity_change')
        product = data.get('product')

        # 1. Correct Quantity Sign (Ensures IN is positive, OUT is negative)
        if transaction_type == Transaction.TransactionType.OUT:
            # For OUT transactions, the quantity must be positive in the input,
            # but we will save it as negative.
            if quantity <= 0:
                 raise serializers.ValidationError({"quantity_change": "Outgoing quantity must be greater than zero."})
            data['quantity_change'] = -quantity
        elif quantity < 0:
             raise serializers.ValidationError({"quantity_change": "Incoming/Adjustment quantities must be zero or positive."})


        # 2. Stock Depletion Prevention (Only check for outgoing transactions)
        if transaction_type == Transaction.TransactionType.OUT:
            try:
                # Assuming Stock model has a ForeignKey to Product and a 'quantity' field
                current_stock = Stock.objects.get(product=product).quantity
            except Stock.DoesNotExist:
                current_stock = 0
            
            # The quantity_change is already converted to a negative number at this point
            required_reduction = abs(data['quantity_change'])
            
            if required_reduction > current_stock:
                raise serializers.ValidationError({
                    "quantity_change": f"Cannot deplete stock. Current stock for '{product.name}' is {current_stock}, but {required_reduction} units were requested."
                })
        
        return data

    def create(self, validated_data):
        """
        Sets the user (if not set by the ViewSet) and records the product's current price.
        """
        
        # --- Handle User Injection (Kept for completeness, but better done in ViewSet) ---
        # Note: If you use ViewSet's perform_create(serializer.save(user=self.request.user)), 
        # this block can be removed.
        if 'user' not in validated_data and self.context.get('request'):
             user = self.context['request'].user
             if user and user.is_authenticated:
                validated_data['user'] = user

        # --- Record Price Snapshot (The primary goal here) ---
        product = validated_data.get('product')
        # Assuming your Product model has a field called 'unit_price'
        validated_data['price'] = product.unit_price 
        
        return super().create(validated_data)
