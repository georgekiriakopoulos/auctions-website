from django.contrib import admin

# Register your models here.
from .models import *


admin.site.register(Auction) 
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Bid)
admin.site.register(Visit)
admin.site.register(Message)


