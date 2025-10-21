from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import F
from .stock_model import Stock
from .product_model import Product
from .user_model import MyCustomUser

class Transaction(models.Model):
    """
    Tracks all inventory movements, crucial for demand prediction.
    The 'type' field uses Django's TextChoices for clarity and enforcement.
    """
    class TransactionType(models.TextChoices):
        IN = 'IN', 'Stock In (Purchase/Return)'
        OUT = 'OUT', 'Stock Out (Sale/Usage)'
        ADJ = 'ADJ', 'Adjustment (Count/Loss)'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=3, choices=TransactionType.choices)
    quantity_change = models.IntegerField(help_text="Positive for IN/ADJ+, negative for OUT/ADJ-")
    timestamp = models.DateTimeField(default=timezone.now)
    # Assumes the user model is configured in settings.AUTH_USER_MODEL
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.type} of {self.quantity_change} units for {self.product.name}"
    
    class Meta:
        ordering = ['-timestamp']
        
    def save(self, *args, **kwargs):
        """
        Custom save method to update the corresponding Stock quantity.
        This is a critical piece of business logic.
        """
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Only update stock on creation, not on subsequent edits of the transaction record
        if is_new:
            # Atomic update of the Stock quantity to prevent race conditions
            stock_record, created = Stock.objects.get_or_create(product=self.product)
            stock_record.quantity = F('quantity') + self.quantity_change
            stock_record.save()
            stock_record.refresh_from_db() # Refresh F expression result
