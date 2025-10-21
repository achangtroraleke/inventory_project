from django.contrib import admin
from .models.user_model import MyCustomUser
from .models.product_model import Product
from .models.transaction_model import Transaction
from .models.stock_model import Stock

# Register your models here.
admin.site.register(MyCustomUser)
admin.site.register(Product)
admin.site.register(Transaction)
admin.site.register(Stock)