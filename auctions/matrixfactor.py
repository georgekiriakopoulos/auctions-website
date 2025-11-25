import numpy
from auctions.models import *
from auctions.serializers import * 

users = User.objects.all()
auctionsSum = Auction.objects.all() 
bids = Bid.objects.all() 
visits = Visit.objects.all()
 


R = numpy.zeros((len(users),len(auctionsSum)))


for i in range(len(R)):
    for j in range(len(R[i])):
        for visit in visits:
            if (visit.visitor == users[i] and visit.visitedAuction == auctionsSum[j]):
                R[i][j] += 0.5
        for bid in bids:
            if (bid.userid == users[i] and bid.auctionid == auctionsSum[j]):
                R[i][j] += 2
            

def matrix_factorization(R, P, Q, K, steps=5000, alpha=0.0002, beta=0.02):
    Q = Q.T
    for step in range(steps):
        for i in range(len(R)):
            for j in range(len(R[i])):
                if R[i][j] > 0:
                    eij = R[i][j] - numpy.dot(P[i,:],Q[:,j])
                    for k in range(K):
                        P[i][k] = P[i][k] + alpha * (2 * eij * Q[k][j] - beta * P[i][k])
                        Q[k][j] = Q[k][j] + alpha * (2 * eij * P[i][k] - beta * Q[k][j])
        eR = numpy.dot(P,Q)
        e = 0
        for i in range(len(R)):
            for j in range(len(R[i])):
                if R[i][j] > 0:
                    e = e + pow(R[i][j] - numpy.dot(P[i,:],Q[:,j]), 2)
                    for k in range(K):
                        e = e + (beta/2) * (pow(P[i][k],2) + pow(Q[k][j],2))
        if e < 0.001:
            break
    return P, Q.T



def mf_execute(R):
    R = numpy.array(R)
    N = len(R)   #Users
    M = len(R[0]) #Auctions
    K = 3  #Features
    
    P = numpy.random.rand(N,K)
    Q = numpy.random.rand(M,K)
    
    nP, nQ = matrix_factorization(R, P, Q, K)
    nR = numpy.dot(nP, nQ.T)
    return nR
 
    

def recAuctions(user):
    nR = mf_execute(R)
    rA = [] 
    for i in range(len(nR)):
        for j in range(len(nR[i])):
            if (users[i] == user):
                rA.append(nR[i][j])
    
    max_value = max(rA)
    max_index = rA.index(max_value)            
    rAuction = auctionsSum[max_index]
    return rAuction.id 