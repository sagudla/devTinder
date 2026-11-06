- install cookie-parser
- cookieParser middleware
- send dummy token(res.cookie) to user
- fetch dummy token(req.cookie) in profile API
- create jwt in login API after emial and password validation
- verify hwt in profile API 
- Create Auth middleware
- create userschema methods for password validate and jet token creation

- ExploreTinder
- Listout APIs
- Create separate routes to griuping APIs
- Express.router
- Create routes folder and create routers for auth, profile and requests
- Export routers
- import in app.js and use each router as middleware

- Implement logout API
- Create profile APIs(Edit Profile, Edit Password)
- Update profile routes in app.js(all "/profile" routes now will go to profile router)

- Create new connection reqeust schem
- New model
- New API for request send
- Schema validation for status enum
- API level validations to cover all the cases for secured API contract
- Schema pre validation
- compound index for frequest query and index and uses
- explore mongodb index and mongoos docs
- ref & populate
- POST vs GET seletcion
- Connections recieved API in user router

- Create GET user/feed API 
  - ignore self view
  - ignore Connection requests (intrested/ignored/rejected)
  - ignore connections (accepted) 
  - there should be no record with fromUserId is he/her or toUserId id he/her

  - /feed?page=0&limit=10 

  - i =n mongo we have skip and limit
  - skip().limit() 1-10 - 0 - l0 - 10
                 - 11-20 - 10

                 - skip = (page-1)*limit