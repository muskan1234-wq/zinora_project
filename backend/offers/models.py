
from django.db import models
from django.utils import timezone


class Offer(models.Model):

    DISCOUNT_CHOICES = [
        ("PERCENTAGE", "Percentage"),
        ("FIXED", "Fixed Amount"),
    ]

    title = models.CharField(max_length=150)

    description = models.TextField(blank=True)

    # Offer banner/image upload
    image = models.ImageField(
        upload_to="offers/",
        blank=True,
        null=True
    )

    coupon_code = models.CharField(
        max_length=50,
        unique=True,
    )

    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_CHOICES,
        default="PERCENTAGE",
    )

    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    minimum_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    start_date = models.DateField()

    end_date = models.DateField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.coupon_code})"

    @property
    def is_currently_active(self):
        today = timezone.localdate()

        return (
            self.is_active
            and self.start_date <= today <= self.end_date
        )
