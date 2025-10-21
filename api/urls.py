from django.urls import path, include
from .views import MyTokenObtainPairView, ProductViewSet, StockViewSet, TransactionViewSet, RegisterUserView

from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'stock', StockViewSet, basename='stock')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register_user'),

    path('', include(router.urls)),
    
]