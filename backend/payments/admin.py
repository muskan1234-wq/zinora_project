from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
 list_display = (
"id",
"payment_id",
"order",
"amount",
"payment_method",
"status",
"created_at",
)


list_filter = (
    "status",
    "payment_method",
    "created_at",
)

search_fields = (
    "payment_id",
    "transaction_id",
)

readonly_fields = (
    "created_at",
    "updated_at",
)
