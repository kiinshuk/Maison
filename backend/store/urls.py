from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    # Cart
    path('cart/', views.cart_view, name='cart'),
    path('cart/clear/', views.clear_cart, name='cart-clear'),
    path('cart/item/<int:item_id>/', views.cart_item_view, name='cart-item'),
    # Orders
    path('orders/', views.order_list, name='order-list'),
    path('orders/place/', views.place_order, name='place-order'),
    path('orders/<int:order_id>/', views.order_detail, name='order-detail'),
    # Auth
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.profile_view, name='profile'),
]
