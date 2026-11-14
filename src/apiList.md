##authRouter
- POST /signup
- POST /login
- POST /logout

##profileRouter
- GET /profie/view
- PATCH /profile/edit
- PATCH /profil/password

##connectionRequestRouter
- POST /request/send/:status/:userID ["interested", "ignored"]

- POST /request/review/:status/:requestID ["accepted", "rejected"]


#useRouter
- GET /user/requests/recieved
- GET /user/connetctions
- GET /user/feed  


- Status: interested,ignored,accepted,rejected