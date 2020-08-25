## NodeJS Trustless authentication system

This is a sample implementation of authentication system without storing user's password in the database. This authentication system is built using [NuID](https://nuid.io/). NuID leverages zero knowledge cryptography and distributed ledger technology that enables users the ability to not trust any system to store their passwords.

## Install packages:

```npm install```

## Start server:

```npm run start```

## Testing APIs

Open the `authRequests.rest` file. This file has sample request examples guiding you to use the authentication system. If you have the visual studio's `Rest.Client` plugin, you can directly send the requests by clicking on the `Send Request` button at the top of every API call listed.

## How does this truly work?

The trustless authentication system has 2 parts to it:

### User Signup:
- User enters his details such as `emailid` and `password` and signs up.
- The user `password` is used to create a onetime verifyable `secret`.
- An API call is made to create user credentails on `Nu.ID` portal. The credentails API gives back an ID called `Nu.ID`
- The user's `email` and `id` is stored in the system.

### User login: 
- User enters his `email` and `password`.
- Retrieve user's `Nu.Id` (public id) from his email and obtain `nuid.credential.challenge/jwt`.
- Decode this `JWT` to get the `challenge` value
- Use the `password` and `challenge` to obtain `proof`
- Hit `/verifyProof` to confirm it is the right user. If the password is correct, the API returns a success response.
- Once user is verified create a session using users `Nu.Id` for further authentication to the APIs.

Note that the `secret` used for credential creation and `proof` created when the user tries to login should be obtained from client side. This way, we are avoiding making any API calls to the server with the user's password and hence mitigating the risk of a potential breech.