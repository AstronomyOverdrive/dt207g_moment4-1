# DT207G Moment 4-1
## About
REST API powered by [Express](https://www.npmjs.com/package/express).<br>
The API handles user registration, login and authentication for viewing stored data.<br>
A [frontend](https://github.com/AstronomyOverdrive/dt207g_moment4-2) for it is also available.
## Installation
### Install server
```sh
git clone https://github.com/AstronomyOverdrive/dt207g_moment4-1.git &&
cd dt207g_moment4-1 &&
npm install
```
This will also pull in the following packages:
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [CORS](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://www.npmjs.com/package/mongoose)

### Setup database
```sh
node install.js
```
This will also create a test user in "useraccounts" and fill "daedricprinces" with daedric princes from the TES games.<br>
*NOTE: You will also need to setup a MongoDB server.*

## Usage
### Start the server
```sh
node server.js
```
After starting the server you can access the API at: [http://0.0.0.0:8000/](http://0.0.0.0:8000/)
### Endpoints
|Action       |Method |Endpoint |Body                                    |Header                                      |
|-------------|-------|---------|----------------------------------------|--------------------------------------------|
|Login user   |POST   |/login   |{"username": "Name", "password": "Pass"}|                                            |
|Register user|POST   |/register|{"username": "Name", "password": "Pass"}|                                            |
|Read entries |GET    |/daedra  |                                        | {"Authorization": "Bearer JSON.Web.Token"} |

*NOTE: Username must be between 5-25 characters*
### Successful response format
**POST /login**<br>
HTTPS Status 200
```
[
	{
		message: 'Login successful',
		token: 'JSON.Web.Token'
	}
]
```
**POST /register**<br>
HTTPS Status 201
```
{ message: 'User UserName created' }
```
**GET /daedra**<br>
HTTPS Status 200
```
[
	{
		_id: 'abc123',
		name: 'Azura',
		realm: 'Moonshadow',
		__v: 0
	},
	...
]
```
### Error response format
**POST /login**<br>
HTTPS Status 401
```
{ message: 'Invalid password' }
```
HTTPS Status 404
```
{ message: 'User UserName not found' }
```
HTTPS Status 500
```
{ message: 'Internal error: Message' }
```
**POST /register**<br>
HTTPS Status 409
```
{ message: 'Username UserName already taken' }
```
HTTPS Status 500
```
{ message: 'Database error: Message' }
```
**GET /daedra**<br>
 HTTPS Status 401
```
{ message: 'Missing token' }
```
 HTTPS Status 403
```
{ message: 'Invalid token' }
```
 HTTPS Status 500
```
{ message: 'Database error: Message' }
```
