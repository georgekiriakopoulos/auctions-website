from rest_framework.response import Response 
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from .models import *  
from .serializers import AuctionSerializer, BidSerializer, CategorySerializer, MessageSerializer, RegisterSerializer, UserSerializer , MyTokenObtainPairSerializer, VisitSerializer
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView  
from rest_framework import generics
from rest_framework_simplejwt.authentication import *
from auctions.matrixfactor import recAuctions

@api_view(['GET', 'POST'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/auctions/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of auctions'
        }
    ]
    return Response(routes)  


@api_view(['GET']) 
def getListOfUsers(request):  
    users = User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data) 
    

@api_view(['GET','PUT', 'DELETE'])
def users_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        user = User.objects.get(id=pk)  
        serializer = UserSerializer(user, many=False) 
        return Response(serializer.data)
    
    if request.method == 'PUT':
        data = request.data
        user = User.objects.get(id=pk) 
        serializer = UserSerializer(instance=user, data=data) 
        if serializer.is_valid():
            serializer.save() 
        return Response(serializer.data) 
    
    if request.method == 'DELETE':
        user = User.objects.get(id=pk)
        user.delete()  
        return Response('User was deleted') 


@api_view(['GET','POST'])  
def getCategories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data) 
    if request.method == 'POST': 
        data = request.data 
        category = Category.objects.create(
            name = data['name']
        )
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'PUT','DELETE'])
def getCategory(request,pk):
    if request.method == 'GET':
        category = Category.objects.get(id=pk)
        serializer = CategorySerializer(category,many=False)
        return Response(serializer.data) 
    if request.method == 'POST': 
        data = request.data 
        category = Category.objects.create(
            name=data['name']
        )
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        data = request.data
        category = Category.objects.get(id=pk)
        serializer = CategorySerializer(instance=category, data=data) 
        if serializer.is_valid():
            serializer.save() 
        return Response(serializer.data) 

    if request.method == 'DELETE':
        category = Category.objects.get(id=pk)
        category.delete()  
        return Response('Category was deleted') 

    
@api_view(['GET', 'POST'])
def getBids(request):
    if request.method == 'GET':
        bids = Bid.objects.all()    
        serializer = BidSerializer(bids, many=True) 
        return Response(serializer.data) 
    if request.method == 'POST':
        data = request.data 
        myuser = User.objects.get(id=data['userid']) 
        myauction = Auction.objects.get(id=data['auctionid']) 
        bid = Bid.objects.create(
            name = data['name'],
            userid = myuser,
            auctionid = myauction,
            time = data['time'],
            amount = data['amount'] 
        )
        serializer = BidSerializer(bid, many=False)
        return Response(serializer.data)
          
@api_view(['GET', 'PUT', 'DELETE']) 
def getBid(request, pk):
    if request.method == 'GET': 
        bid = Bid.objects.get(id=pk)  
        serializer = BidSerializer(bid, many=False) 
        return Response(serializer.data) 
    
    if request.method == 'PUT':
        data = request.data
        bid = Bid.objects.get(id=pk)  
        serializer = BidSerializer(instance=bid, data=data) 
        if serializer.is_valid():
            serializer.save()   
        return Response(serializer.data)
    
    if request.method == 'DELETE':
        bid = Bid.objects.get(id=pk)
        bid.delete()  
        return Response('Bid was deleted') 

@api_view(['GET', 'POST', 'PUT'])    
def getAuctions(request): 
    if request.method == 'GET':
        auctions = Auction.objects.all()    
        serializer = AuctionSerializer(auctions, many=True) 
        return Response(serializer.data)    
    if request.method == 'POST':
        data = request.data 
        myseller = User.objects.get(pk=data['seller'])
        mycategory = Category.objects.get(name=data['categories']) 
        auction = Auction.objects.create(
            name = data['name'],
            categories = mycategory,  
            buy_price = data['buy_price'],
            first_bid = data['first_bid'],
            location = data['location'],
            country = data['country'],
            latitude = data['latitude'],
            longitude = data['longitude'], 
            started = data['started'],
            ends = data['ends'],
            seller = myseller,
            description = data['description']
        )
        serializer = AuctionSerializer(auction, many=False)
        return Response(serializer.data)
        

@api_view(['GET','PUT', 'DELETE'])
def getAuction(request, pk):
    if request.method == 'GET': 
        auction = Auction.objects.get(id=pk)  
        serializer = AuctionSerializer(auction, many=False) 
        return Response(serializer.data)
    if request.method == 'POST': 
        data = request.data 
        auction = Auction.objects.create(
            body=data['body']
        )
        serializer = AuctionSerializer(Auction, many=False)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        data = request.data
        auction = Auction.objects.get(id=pk) 
        serializer = AuctionSerializer(instance=auction, data=data) 
        if serializer.is_valid():
            serializer.save()                        
        return Response(serializer.data)
    
    if request.method == 'DELETE':
        auction = Auction.objects.get(id=pk)
        auction.delete() 
        return Response('Auction was deleted')

@api_view(['GET'])
def getRecommendedAuctions(request,pk):
    user = User.objects.get(id=pk) 
    auctionId = recAuctions(user)
    recAuction = Auction.objects.get(id=auctionId)
    serializer = AuctionSerializer(recAuction,many=False) 
    return Response(serializer.data) 


@api_view(['GET', 'POST'])
def getVisits(request):
    if request.method == 'GET':
        visits = Visit.objects.all()    
        serializer = VisitSerializer(visits, many=True) 
        return Response(serializer.data) 
    if request.method == 'POST':
        data = request.data 
        myvisitor = User.objects.get(id=data['visitor']) 
        myvisitedAuction = Auction.objects.get(id=data['visitedAuction']) 
        visit = Visit.objects.create(
            visitor = myvisitor,
            visitedAuction = myvisitedAuction
        )
        serializer = VisitSerializer(visit, many=False)
        return Response(serializer.data)
          
@api_view(['GET']) 
def getVisit(request, pk):
    if request.method == 'GET': 
        visit = Visit.objects.get(id=pk)  
        serializer = VisitSerializer(visit, many=False) 
        return Response(serializer.data) 
    

@api_view(['GET', 'POST'])
def getMessages(request):
    if request.method == 'GET':
        messages = Message.objects.all()     
        serializer = MessageSerializer(messages, many=True) 
        return Response(serializer.data) 
    if request.method == 'POST':
        data = request.data 
        mysender = User.objects.get(id=data['sender']) 
        myreceiver = User.objects.get(id=data['receiver']) 
        myclosedAuction = Auction.objects.get(name=data['closedAuction'])
        message = Message.objects.create(
            sender = mysender,
            receiver = myreceiver,
            textMessage = data['textMessage'],
            closedAuction = myclosedAuction
        )
        serializer = MessageSerializer(message, many=False)
        return Response(serializer.data)
          
@api_view(['GET', 'DELETE']) 
def getMessage(request, pk):
    if request.method == 'GET': 
        message = Message.objects.get(id=pk)  
        serializer = MessageSerializer(message, many=False) 
        return Response(serializer.data)
    if request.method == 'DELETE':
        message = Message.objects.get(id=pk)
        message.delete() 
        return Response('Message was deleted') 


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

