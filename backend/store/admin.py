from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    fields = ['name', 'slug', 'description', 'image']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image_url', 'alt_text', 'is_primary']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_available', 'is_featured', 'rating']
    list_filter = ['category', 'is_available', 'is_featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage_display']
    inlines = [ProductImageInline]
    fieldsets = (
        ('Basic Info', {
            'fields': ('category', 'name', 'slug', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price', 'discount_percentage_display')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Inventory', {
            'fields': ('stock', 'is_available', 'is_featured')
        }),
        ('Stats', {
            'fields': ('rating', 'review_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def discount_percentage_display(self, obj):
        return f'{obj.discount_percentage}%' if obj.discount_percentage else '—'
    discount_percentage_display.short_description = 'Discount'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary']
    fields = ['product', 'image_url', 'alt_text', 'is_primary']


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status']
    readonly_fields = ['user', 'total_amount', 'shipping_name', 'shipping_email',
                       'shipping_phone', 'shipping_address', 'created_at', 'updated_at']
    fields = ['user', 'status', 'total_amount', 'shipping_name', 'shipping_email',
              'shipping_phone', 'shipping_address', 'created_at', 'updated_at']
    inlines = [OrderItemInline]

    def has_add_permission(self, request):
        return False


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']
    list_filter = ['rating']
    readonly_fields = ['product', 'user', 'created_at']

    def has_add_permission(self, request):
        return False


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at']
    readonly_fields = ['user', 'session_key', 'created_at', 'updated_at']

    def has_add_permission(self, request):
        return False


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity']
    readonly_fields = ['cart', 'product', 'quantity']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
