from rest_framework import serializers
from django.contrib.auth.models import User
from django.conf import settings
from .models import Category, Product, ProductImage, Cart, CartItem, Order, OrderItem, Review


def get_full_image_url(image_field, request=None):
    if not image_field:
        return None
    
    url = str(image_field) if image_field else None
    
    if not url or url == '' or url == 'None':
        return None
    
    if url.startswith('http'):
        return url
    
    if hasattr(image_field, 'url') and image_field:
        try:
            url = image_field.url
            if url.startswith('http'):
                return url
        except:
            pass
    
    if url.startswith('/media/'):
        backend_url = getattr(settings, 'BACKEND_URL', None)
        if backend_url:
            return f"{backend_url}{url}"
        if request:
            return request.build_absolute_uri(url)
        return settings.MEDIA_URL + url
    
    return settings.MEDIA_URL + url


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()

    def get_image(self, obj):
        return get_full_image_url(obj.image, self.context.get('request'))


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary']

    def get_image_url(self, obj):
        return get_full_image_url(obj.image_url, self.context.get('request'))


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'compare_price',
            'image', 'image_url', 'stock', 'is_available', 'is_featured',
            'rating', 'review_count', 'category', 'category_name',
            'category_slug', 'discount_percentage', 'images', 'created_at'
        ]

    def get_image(self, obj):
        return get_full_image_url(obj.image, self.context.get('request'))

    def get_image_url(self, obj):
        return get_full_image_url(obj.image_url, self.context.get('request'))


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_amount', 'shipping_address',
            'shipping_name', 'shipping_email', 'shipping_phone',
            'items', 'created_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'username', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
