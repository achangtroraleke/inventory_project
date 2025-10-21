from django.db import models

from .product_model import Product

class Stock(models.Model):
    """
    Tracks the current quantity and location of a product.
    Note: For simplicity, 'location' is a CharField as discussed in the roadmap.
    """
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='stock')
    location = models.CharField(max_length=100, default='Warehouse A')
    quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity} units)"
    
    class Meta:
        verbose_name_plural = "Stock Levels"