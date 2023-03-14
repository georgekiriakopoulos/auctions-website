from django.urls import path 
from . import views 
from .views import MyTokenObtainPairView, RegisterView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('', views.getRoutes, name="routes"), 
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('users/', views.getListOfUsers, name="users"),  
    path('users/<str:pk>/', views.users_detail, name="users_detail"),
    path('categories/', views.getCategories, name="Categories"),
    path('categories/<str:pk>', views.getCategory, name='category'), 
    path('bids/', views.getBids, name="Bids"),
    path('bids/<str:pk>', views.getBid, name='Bid'), 
    path('auctions/', views.getAuctions, name="auctions"),  
    path('auctions/<str:pk>/', views.getAuction, name="auction"),
    path('visits/', views.getVisits, name="visits"),  
    path('visits/<str:pk>/', views.getVisit, name="visit"),
    path('recommendedauctions/<str:pk>/', views.getRecommendedAuctions, name="recommended_Auctions"),  
    path('messages/', views.getMessages, name="messages"),  
    path('messages/<str:pk>/', views.getMessage, name="message"),
] 