from rest_framework import serializers
from .models import User,Auction,Category,Bid,Visit,Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user): 
        if user.is_accepted:  #is active 
            token = super().get_token(user)
            token['username'] = user.username
            token['name'] = user.name
            token['is_staff'] = user.is_staff 
            token['is_seller'] = user.is_seller
            token['is_bidder'] = user.is_bidder 
            token['seller_rating'] = user.seller_rating 
            token['bidder_rating'] = user.bidder_rating 
            return token 
        else:
            return ValueError("Error at logging in user.")
        

class UserListSerializer(serializers.ModelSerializer):
    @classmethod                                        ###########
    def get_userlist(cls,user):
        print(user.username) 
    class Meta:
        model = User
        fields = ('__all__')
            
         


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'name', 'surname', 'mobile_phone', 'email', 
                  'address', 'scn', 'is_seller', 'is_bidder','is_staff', 'is_active', 'is_accepted')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            name=validated_data['name'],
            surname=validated_data['surname'],
            mobile_phone=validated_data['mobile_phone'],
            email=validated_data['email'],
            address=validated_data['address'],
            scn=validated_data['scn'],
            is_seller=validated_data['is_seller'],
            is_bidder=validated_data['is_bidder'],
        )

        user.set_password(validated_data['password'])
        user.save()
        return user 


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category 
        fields = '__all__' 
        extra_kwargs = {
            'name': {'validators': []},
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AuctionSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=False,read_only=True)
    seller = serializers.PrimaryKeyRelatedField(many=False,read_only=True)
    class Meta:
        model = Auction 
        fields = '__all__' 
        extra_kwargs = {'bids': {'required': False}}

        
        
class BidSerializer(serializers.ModelSerializer): 
    userid = serializers.PrimaryKeyRelatedField(many=False, read_only=True) 
    auctionid = serializers.PrimaryKeyRelatedField(many=False, read_only=True)  
    class Meta: 
        model = Bid 
        fields = '__all__'
    

class VisitSerializer(serializers.ModelSerializer):
    visitor = serializers.PrimaryKeyRelatedField(many=False, read_only=True) 
    visitedAuction = serializers.PrimaryKeyRelatedField(many=False, read_only=True)  
    class Meta: 
        model = Visit 
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(many=False, read_only=True) 
    receiver = serializers.PrimaryKeyRelatedField(many=False, read_only=True) 
    closedAuction = serializers.SlugRelatedField(many=False, read_only=True, slug_field='name') 

    class Meta:
        model = Message 
        fields = '__all__'
     
