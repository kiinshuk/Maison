import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product, ProductImage

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@homedecor.com', 'admin123')
    print("Superuser created: admin / admin123")

# Categories
categories_data = [
    {'name': 'Living Room', 'slug': 'living-room', 'description': 'Furniture and decor for your living room'},
    {'name': 'Bedroom', 'slug': 'bedroom', 'description': 'Beautiful bedroom essentials'},
    {'name': 'Kitchen & Dining', 'slug': 'kitchen-dining', 'description': 'Kitchen and dining accessories'},
    {'name': 'Bathroom', 'slug': 'bathroom', 'description': 'Luxury bathroom decor'},
    {'name': 'Wall Art', 'slug': 'wall-art', 'description': 'Stunning wall art and prints'},
    {'name': 'Lighting', 'slug': 'lighting', 'description': 'Beautiful lighting solutions'},
    {'name': 'Plants & Planters', 'slug': 'plants-planters', 'description': 'Indoor plants and stylish planters'},
    {'name': 'Cushions & Throws', 'slug': 'cushions-throws', 'description': 'Cozy cushions and throws'},
]

categories = {}
for cat_data in categories_data:
    cat, _ = Category.objects.get_or_create(slug=cat_data['slug'], defaults=cat_data)
    categories[cat_data['slug']] = cat
print(f"Created {len(categories)} categories")

# Products
products_data = [
    # Living Room
    {
        'category': 'living-room', 'name': 'Nordic Wooden Coffee Table',
        'slug': 'nordic-wooden-coffee-table', 'price': 249.99, 'compare_price': 329.99,
        'stock': 15, 'is_featured': True, 'rating': 4.7, 'review_count': 132,
        'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        'description': 'Minimalist Nordic-style coffee table crafted from solid oak wood. Features clean lines and a natural finish that complements any modern living room.',
    },
    {
        'category': 'living-room', 'name': 'Velvet Sofa 3-Seater',
        'slug': 'velvet-sofa-3-seater', 'price': 899.00, 'compare_price': 1199.00,
        'stock': 8, 'is_featured': True, 'rating': 4.8, 'review_count': 89,
        'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        'description': 'Luxurious velvet sofa with deep button-tufting. Available in emerald green, dusty rose, and midnight blue.',
    },
    {
        'category': 'living-room', 'name': 'Rattan Accent Chair',
        'slug': 'rattan-accent-chair', 'price': 189.99, 'compare_price': 249.99,
        'stock': 20, 'is_featured': False, 'rating': 4.5, 'review_count': 67,
        'image_url': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600',
        'description': 'Bohemian-inspired rattan accent chair with plush seat cushion. Perfect for reading nooks and sunny corners.',
    },
    {
        'category': 'living-room', 'name': 'Marble Side Table',
        'slug': 'marble-side-table', 'price': 149.99, 'compare_price': None,
        'stock': 25, 'is_featured': False, 'rating': 4.6, 'review_count': 43,
        'image_url': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
        'description': 'Elegant marble-top side table with gold metal base. Adds a touch of luxury to any room.',
    },
    {
        'category': 'living-room', 'name': 'Geometric Bookshelf',
        'slug': 'geometric-bookshelf', 'price': 179.00, 'compare_price': 229.00,
        'stock': 12, 'is_featured': True, 'rating': 4.4, 'review_count': 55,
        'image_url': 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600',
        'description': 'Modern geometric bookshelf with open compartments. Ideal for displaying books, plants, and decor pieces.',
    },
    # Bedroom
    {
        'category': 'bedroom', 'name': 'Linen Duvet Cover Set',
        'slug': 'linen-duvet-cover-set', 'price': 89.99, 'compare_price': 119.99,
        'stock': 50, 'is_featured': True, 'rating': 4.9, 'review_count': 214,
        'image_url': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600',
        'description': 'Premium 100% linen duvet cover set. Breathable, durable, and gets softer with every wash. Includes duvet cover and two pillowcases.',
    },
    {
        'category': 'bedroom', 'name': 'Japandi Platform Bed Frame',
        'slug': 'japandi-platform-bed-frame', 'price': 599.00, 'compare_price': 799.00,
        'stock': 5, 'is_featured': True, 'rating': 4.7, 'review_count': 76,
        'image_url': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
        'description': 'Low-profile platform bed frame inspired by Japanese design. Solid walnut wood with a matte finish.',
    },
    {
        'category': 'bedroom', 'name': 'Macrame Wall Hanging',
        'slug': 'macrame-wall-hanging', 'price': 45.00, 'compare_price': None,
        'stock': 30, 'is_featured': False, 'rating': 4.6, 'review_count': 98,
        'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'description': 'Handcrafted boho macrame wall hanging made from natural cotton rope. Adds texture and warmth to bedroom walls.',
    },
    {
        'category': 'bedroom', 'name': 'Wooden Bedside Table',
        'slug': 'wooden-bedside-table', 'price': 129.99, 'compare_price': 159.99,
        'stock': 18, 'is_featured': False, 'rating': 4.5, 'review_count': 61,
        'image_url': 'https://images.unsplash.com/photo-1616627988078-b13c0af4bb8f?w=600',
        'description': 'Scandinavian-style bedside table with drawer and lower shelf. Natural oak finish.',
    },
    # Kitchen & Dining
    {
        'category': 'kitchen-dining', 'name': 'Ceramic Dinnerware Set (16pc)',
        'slug': 'ceramic-dinnerware-set', 'price': 119.99, 'compare_price': 159.99,
        'stock': 22, 'is_featured': True, 'rating': 4.8, 'review_count': 187,
        'image_url': 'https://images.unsplash.com/photo-1571104508999-893933ded431?w=600',
        'description': '16-piece handcrafted ceramic dinnerware set. Microwave and dishwasher safe. Available in terracotta, sage, and cream.',
    },
    {
        'category': 'kitchen-dining', 'name': 'Bamboo Cutting Board Set',
        'slug': 'bamboo-cutting-board-set', 'price': 39.99, 'compare_price': 54.99,
        'stock': 45, 'is_featured': False, 'rating': 4.7, 'review_count': 312,
        'image_url': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600',
        'description': 'Set of 3 sustainably sourced bamboo cutting boards in graduated sizes. With juice groove and hanging holes.',
    },
    {
        'category': 'kitchen-dining', 'name': 'Glass Storage Jars Set',
        'slug': 'glass-storage-jars-set', 'price': 34.99, 'compare_price': None,
        'stock': 60, 'is_featured': False, 'rating': 4.6, 'review_count': 143,
        'image_url': 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600',
        'description': 'Set of 6 airtight glass storage jars with bamboo lids. Perfect for pantry organization.',
    },
    # Bathroom
    {
        'category': 'bathroom', 'name': 'Spa Towel Bundle Set',
        'slug': 'spa-towel-bundle-set', 'price': 69.99, 'compare_price': 89.99,
        'stock': 35, 'is_featured': False, 'rating': 4.8, 'review_count': 201,
        'image_url': 'https://images.unsplash.com/photo-1600369671773-6a0d4e3d2439?w=600',
        'description': '6-piece luxury towel set made from 600 GSM Egyptian cotton. Includes 2 bath towels, 2 hand towels, and 2 washcloths.',
    },
    {
        'category': 'bathroom', 'name': 'Teak Wood Bath Caddy',
        'slug': 'teak-wood-bath-caddy', 'price': 79.99, 'compare_price': 99.99,
        'stock': 14, 'is_featured': True, 'rating': 4.9, 'review_count': 88,
        'image_url': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
        'description': 'Adjustable teak wood bath caddy tray with wine glass holder, book rest, and soap dish. Transform your bath into a spa.',
    },
    # Wall Art
    {
        'category': 'wall-art', 'name': 'Abstract Canvas Print Set (3pc)',
        'slug': 'abstract-canvas-print-set', 'price': 89.99, 'compare_price': 129.99,
        'stock': 28, 'is_featured': True, 'rating': 4.6, 'review_count': 174,
        'image_url': 'https://images.unsplash.com/photo-1579541591970-288a6090bf24?w=600',
        'description': 'Set of 3 abstract canvas prints in warm earth tones. Gallery-wrapped and ready to hang.',
    },
    {
        'category': 'wall-art', 'name': 'Botanical Art Prints (Set of 4)',
        'slug': 'botanical-art-prints', 'price': 59.99, 'compare_price': 79.99,
        'stock': 40, 'is_featured': False, 'rating': 4.7, 'review_count': 253,
        'image_url': 'https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=600',
        'description': 'Set of 4 vintage botanical illustration prints. Printed on heavyweight matte paper.',
    },
    {
        'category': 'wall-art', 'name': 'Circular Rattan Mirror',
        'slug': 'circular-rattan-mirror', 'price': 74.99, 'compare_price': None,
        'stock': 16, 'is_featured': True, 'rating': 4.8, 'review_count': 119,
        'image_url': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600',
        'description': 'Boho circular mirror with handwoven natural rattan frame. 24" diameter, perfect for entryways and bedrooms.',
    },
    # Lighting
    {
        'category': 'lighting', 'name': 'Rattan Pendant Light',
        'slug': 'rattan-pendant-light', 'price': 94.99, 'compare_price': 129.99,
        'stock': 20, 'is_featured': True, 'rating': 4.7, 'review_count': 96,
        'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
        'description': 'Handwoven rattan pendant light shade. Creates warm, dappled light patterns. E27 bulb fitting.',
    },
    {
        'category': 'lighting', 'name': 'Marble Base Table Lamp',
        'slug': 'marble-base-table-lamp', 'price': 114.99, 'compare_price': 149.99,
        'stock': 12, 'is_featured': False, 'rating': 4.5, 'review_count': 72,
        'image_url': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600',
        'description': 'Elegant table lamp with a genuine white marble base and linen shade. A timeless piece for any bedside or console table.',
    },
    {
        'category': 'lighting', 'name': 'Edison Bulb String Lights',
        'slug': 'edison-bulb-string-lights', 'price': 34.99, 'compare_price': 44.99,
        'stock': 55, 'is_featured': False, 'rating': 4.6, 'review_count': 421,
        'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
        'description': '10m outdoor/indoor Edison bulb fairy lights. Warm white 2700K, weather-resistant cable.',
    },
    # Plants & Planters
    {
        'category': 'plants-planters', 'name': 'Terracotta Planter Set (3pc)',
        'slug': 'terracotta-planter-set', 'price': 44.99, 'compare_price': 59.99,
        'stock': 38, 'is_featured': True, 'rating': 4.8, 'review_count': 167,
        'image_url': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
        'description': 'Set of 3 handmade terracotta planters in graduated sizes. Each pot has a drainage hole and matching saucer.',
    },
    {
        'category': 'plants-planters', 'name': 'Cement Geometric Planter',
        'slug': 'cement-geometric-planter', 'price': 29.99, 'compare_price': None,
        'stock': 42, 'is_featured': False, 'rating': 4.5, 'review_count': 89,
        'image_url': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600',
        'description': 'Modern geometric cement planter with a matte finish. Suitable for succulents and small houseplants.',
    },
    # Cushions & Throws
    {
        'category': 'cushions-throws', 'name': 'Chunky Knit Throw Blanket',
        'slug': 'chunky-knit-throw-blanket', 'price': 64.99, 'compare_price': 84.99,
        'stock': 30, 'is_featured': True, 'rating': 4.9, 'review_count': 298,
        'image_url': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        'description': 'Hand-knitted chunky merino wool throw blanket. Ultra-soft, warm, and available in 6 cozy colors.',
    },
    {
        'category': 'cushions-throws', 'name': 'Velvet Cushion Cover Set (4pc)',
        'slug': 'velvet-cushion-cover-set', 'price': 49.99, 'compare_price': 69.99,
        'stock': 45, 'is_featured': False, 'rating': 4.7, 'review_count': 183,
        'image_url': 'https://images.unsplash.com/photo-1586105449897-20b5efeb3233?w=600',
        'description': 'Set of 4 luxury velvet cushion covers in complementary tones. Hidden zip closure. 45x45cm.',
    },
]

created = 0
for p_data in products_data:
    cat_slug = p_data.pop('category')
    cat = categories[cat_slug]
    product, c = Product.objects.get_or_create(
        slug=p_data['slug'],
        defaults={**p_data, 'category': cat}
    )
    if c:
        created += 1

print(f"Created {created} products")
print("Seed data complete!")
