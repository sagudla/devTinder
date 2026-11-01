##authRouter
- POST /signup
- POST /login
- POST /logout

##profileRouter
- GET /profie/view
- PATCH /profile/edit
- PATCH /profil/password

##connectionRequestRouter
- POST /request/send/intrested/:userID
- POST /request/send/ignored/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

#3useRouter
- GET /user/connetctions
- GET /user/requests/recieved
- GET /user/feed 


- Satatus: intrested,ignored,accepted,rejected