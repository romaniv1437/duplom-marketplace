from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser


class Profile(models.Model):
    """
        Avatar
    """
    avatar = models.ImageField(upload_to='media/profile/%Y/%m/%d/', verbose_name='Аватар')

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


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(profile=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
