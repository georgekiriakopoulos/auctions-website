from ast import List
from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,PermissionsMixin,BaseUserManager
from django.contrib.auth.models import UserManager
from django.contrib.auth.models import Group
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.models import Session


class CustomUserManager(BaseUserManager):
    def create_superuser(self,username,password,name,surname,mobile_phone,email,address,scn,is_seller,is_bidder,is_accepted,**other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True) 
        other_fields.setdefault('is_active', True)
        
        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_active') is not True:
            raise ValueError(
                'Superuser must be assigned to is_active=True.')
        

        return self.create_user(username,password,name,surname,mobile_phone,email,address,scn,is_seller,is_bidder,is_accepted ,**other_fields)
    
    def create_user(self, username,password,name,surname,mobile_phone,email,address,scn,is_seller,is_bidder,is_accepted,**other_fields):
        if not username:
            raise ValueError('You must provide a username!')
            
        email = self.normalize_email(email)
        user = self.model(email=email, username=username,
                          name=name, surname=surname, mobile_phone=mobile_phone,
                          address=address, scn=scn, is_seller=is_seller, is_bidder=is_bidder,
                          is_accepted=is_accepted,**other_fields)
        user.set_password(password)
        user.save()
        
        
        return user 
    

    
class User(AbstractBaseUser):
    username = models.CharField(max_length=200,blank=False,unique=True)
    name = models.CharField(max_length=200,blank=False)
    surname = models.CharField(max_length=200,blank=False)
    mobile_phone = models.CharField(max_length=20,blank=False) 
    email = models.EmailField(max_length=200,blank=False)
    address = models.CharField(max_length=500,blank=False) 
    scn = models.TextField(max_length=10,blank=False) 
    is_seller = models.BooleanField(default=False)
    is_bidder = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True) 
    is_accepted = models.BooleanField(default=False)
    seller_rating = models.IntegerField(blank=True,null=True)
    bidder_rating = models.IntegerField(blank=True,null=True)  
    location = models.CharField(max_length=200,blank=False,null=True)
    country = models.CharField(max_length=200,blank=False,null=True) 
    
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['name', 'surname', 'mobile_phone',
                      'email', 'address', 'scn', 'is_seller',    
                      'is_bidder', 'is_accepted']  
    
    
    def __str__(self):
        return self.username
    
   



class Category(models.Model):
    name = models.CharField(max_length=200,blank=False,unique=True)
    def __str__(self):
        return self.name



class Auction(models.Model):
    name = models.CharField(max_length=200,blank=False, null=True)
    categories = models.ForeignKey(Category,on_delete=models.CASCADE,null=True,blank=True)
    currently = models.IntegerField(blank=True,null=True)
    buy_price = models.IntegerField(blank=True,null=True)
    first_bid = models.IntegerField(blank=False, null=True)
    number_of_bids = models.IntegerField(blank=True, null=True)  
    location = models.CharField(max_length=200,blank=False, null=True)
    country = models.CharField(max_length=200,blank=False,null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6,blank=True,null=True) 
    longitude = models.DecimalField(max_digits=9, decimal_places=6,blank=True,null=True) 
    started = models.DateTimeField(null=True)
    ends = models.DateTimeField(null=True) 
    seller = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True) 
    description = models.CharField(max_length=1000, null=True)
    isOpen = models.BooleanField(default=True,blank=True,null=True)
    winner =  models.IntegerField(blank=True, null=True)  
    
    REQUIRED_FIELDS = ['name'] 
    
    def __str__(self):
        return self.name 
    

class Bid(models.Model):
    name = models.CharField(max_length=200,blank=True,unique=False,null=True) 
    auctionid = models.ForeignKey(Auction,on_delete=models.CASCADE,related_name='auctionid', null=True)  
    userid = models.ForeignKey(User,on_delete=models.CASCADE,related_name='userid', null=True) 
    time = models.DateTimeField(auto_now_add=True, null=True) 
    amount = models.IntegerField(blank=False,null=True) 
    accepted = models.BooleanField(blank=True,null=True,default=False) 
        
    def __str__(self):
        return self.name 
    
    
class Visit(models.Model):
    visitor = models.ForeignKey(User,on_delete=models.CASCADE,related_name='visitor', null=True)
    visitedAuction = models.ForeignKey(Auction,on_delete=models.CASCADE,related_name='visitedAuction', null=True)  

class Message(models.Model):
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='sender', null=True)
    receiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='receiver', null=True)
    textMessage = models.CharField(max_length=500,blank=False, null=True)
    closedAuction = models.ForeignKey(Auction,on_delete=models.CASCADE,related_name='closedAuction', null=True)  


