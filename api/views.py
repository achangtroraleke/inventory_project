from django.shortcuts import render

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwner
from django.contrib.auth.hashers import make_password
from rest_framework.views import Response
# Imported Models
from .models.product_model import Product
from .models.stock_model import Stock
from .models.transaction_model import Transaction
from .models.user_model import MyCustomUser

# Imported Serializers
from .serializers.product_serializer import ProductSerializer
from .serializers.stock_serializer import StockSerializer
from .serializers.transaction_serializer import TransactionSerializer
from .serializers.user_serializer import MyUserSerializer
# Create your views here.

# --- PUBLIC REGISTRATION VIEW (The one causing the error) ---
class RegisterUserView(generics.CreateAPIView):
    """
    Handles user registration. Explicitly set to AllowAny to bypass 
    the global IsAuthenticated default.
    """
    serializer_class = MyUserSerializer
    
    # CRITICAL: This line guarantees public access.
    permission_classes = [AllowAny] 
    
    def create(self, request, *args, **kwargs):
        # *** DEBUGGING STEP: Check your console for this print. If you see it, 
        # the error is inside the view logic, not permissions. ***
        print("--- Registration request successfully bypassed permissions! ---")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Hash password and save
        validated_data = serializer.validated_data
        validated_data['password'] = make_password(validated_data['password'])
        
        self.perform_create(serializer)
        
        return Response(
            {'message': 'Registration successful. Please log in.'}, 
            status=status.HTTP_201_CREATED
        )

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    Requires authentication (IsAuthenticated) as per roadmap Phase 0.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsOwner] # Ensures only logged-in users can access

    def get_queryset(self):

        user = self.request.user
        if user.is_authenticated:
             # Prefetching related data is good practice for performance
             return Product.objects.filter(user=user).prefetch_related('transactions')
        
        # Security fallback: If somehow an unauthenticated request reaches here, return empty.
        return Product.objects.none()
    def perform_create(self, serializer):
        """
        Automatically sets the 'user' field on the Product model 
        to the currently authenticated user before saving the new product.
        """
        # 3. OWNER INJECTION: Pass the current user instance to the serializer's save method
        serializer.save(user=self.request.user)

class StockViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing current stock levels.
    ReadOnly because stock is only updated automatically via the Transaction model's save method.
    """
    # Use select_related to efficiently fetch the product name for the serializer
    queryset = Stock.objects.select_related('product').all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]
    
    # Optional: Filter to show only low stock items
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get('low_stock') == 'true':
             # Note: This check relies on having the reorder_point value on the Product model
            return queryset.filter(quantity__lte=F('product__reorder_point'))
        return queryset
    
    
class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows recording inventory transactions.
    """
    queryset = Transaction.objects.select_related('product', 'user').all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]