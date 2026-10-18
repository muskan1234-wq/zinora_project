from django.db import models

PAYMENT_METHOD_CHOICES = [
    ("COD", "Cash on Delivery"),
    ("UPI", "UPI"),
    ("CARD", "Card"),
    ("NETBANKING", "Net Banking"),
    ("WALLET", "Wallet"),
]

PAYMENT_STATUS_CHOICES = [
    ("PENDING", "Pending"),
    ("SUCCESS", "Successful"),
    ("FAILED", "Failed"),
    ("REFUNDED", "Refunded"),
]


class Payment(models.Model):
    order = models.ForeignKey(
        "orders.Order",
        on_delete=models.PROTECT,
        related_name="payments",
    )
    payment_id = models.CharField(max_length=50, unique=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default="COD",
    )
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.payment_id} - {self.status}"
