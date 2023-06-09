from django.contrib import admin
from .models import Profile, Rating


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('pk', 'avatar', 'profile')
    list_display_links = ('pk', 'profile')


class RatingProfile(admin.ModelAdmin):
    list_display = ('pk', 'stars', 'from_user', 'for_user')
    list_display_links = ('pk', 'from_user', 'for_user')


admin.site.register(Profile, ProfileAdmin)
admin.site.register(Rating, RatingProfile)