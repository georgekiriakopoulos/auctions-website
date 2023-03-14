from django.contrib import admin
from django.urls import path, include, re_path
from auctions import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('api/', include('auctions.urls')),
]
