from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('pk', 'avatar', 'profile')
    list_display_links = ('pk', 'profile')


admin.site.register(Profile, ProfileAdmin)
