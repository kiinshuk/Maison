from django.contrib import admin
from django.contrib.admin import AdminSite
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review
from .admin import (
    CategoryAdmin, ProductAdmin, ProductImageAdmin, 
    OrderAdmin, ReviewAdmin, CartAdmin, CartItemAdmin
)


class MaisonAdminSite(AdminSite):
    site_header = 'Maison HomeDecor Admin'
    site_title = 'Maison Admin'
    index_title = 'Dashboard'
    
    def index(self, request, extra_context=None):
        context = {
            'total_products': Product.objects.count(),
            'total_categories': Category.objects.count(),
            'total_orders': Order.objects.count(),
            'total_users': Order.objects.values('user').distinct().count(),
            'total_revenue': Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0,
            'pending_orders': Order.objects.filter(status='pending').count(),
            'low_stock': Product.objects.filter(stock__lt=10).count(),
            'featured_products': Product.objects.filter(is_featured=True).count(),
            'recent_orders': Order.objects.order_by('-created_at')[:5],
        }
        return super().index(request, extra_context=context)


admin_site = MaisonAdminSite(name='maison_admin')
admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(ProductImage, ProductImageAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(Cart, CartAdmin)
admin_site.register(CartItem, CartItemAdmin)
