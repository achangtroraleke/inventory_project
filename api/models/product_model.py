from django.db import models
from django.conf import settings
class Product(models.Model):
    """
    Defines the core inventory item.
    """
    # Key Fields as defined in the roadmap
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    SKU = models.CharField(max_length=50, unique=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_point = models.IntegerField(default=10, help_text="Minimum stock level before reordering.")

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']