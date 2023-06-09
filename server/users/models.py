from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser


class Profile(models.Model):
    """
        Avatar
    """
    avatar = models.ImageField(upload_to='profile/%Y/%m/%d/', blank=True, verbose_name='Аватар')
    
    profile = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )


    class Meta:
        verbose_name = 'Профіль'
        verbose_name_plural = 'Профіль'


    def __str__(self):
        return str(self.profile)


class Rating(models.Model):
    stars = (
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    )

    stars = models.PositiveIntegerField(choices=stars)
    from_user = models.ForeignKey(Profile, on_delete=models.PROTECT)
    for_user = models.ForeignKey(User, on_delete=models.PROTECT)


    def __str__(self):
        return self.for_user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(profile=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
