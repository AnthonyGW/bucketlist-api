# Bucketlist App API

Just a simple API written with express.js \
A user can sign up, log in and manage bucketlists. Data is persisted using MongoDB.

## Setup
1. Ensure node and npm are installed on the target machine. Mongo daemon must be running on the default port.
2. Install node dependencies with `npm install`.
3. Start the server with `node app.js` or `nodemon`.
4. Test the following endpoints:

| Type | Endpoint | Data | Authorization Required | Expected Response |
| --- | --- | --- | --- | --- | 
| `POST` | `/signup` | `{ email, username, password, confirmPassword }` | `No` | `200, { message: "<username> created successfully." }` |
| `POST` | `/login` | `{ email, password }` | `No` | `200, { message: "Authorization successful. Check session ID named connect.sid in cookies." }` |
| `GET` | `/logout` | None | `No` | `200, { message: "Logged out successfully." }`
| `GET` | `/bucketlists` | None | `Yes` | `200, [ <bucketlist objects> ]` |
| `POST` | `/bucketlists` | `{ bucketlistName, bucketlistDescription, createDate, updateDate }` | `Yes` | `200, { <created bucketlist object> }` |
| `PUT` | `/bucketlists:bucketlistId` | `{ bucketlistName, bucketlistDescription, updateDate }` | `Yes` | `200, { <updated bucketlist object> }` |
| `DELETE` | `/bucketlists:bucketlistId` | None | `Yes` | `200, { message: "Successfully removed bucketlist." }` |
| `GET` | `/bucketlists:bucketlistId/items` | None | `Yes` | `200, [ <bucketlist item objects> ]` |
| `POST` | `bucketlists:bucketlistId/items` | `{ itemName, itemDescription, itemCreateDate, itemUpdateDate }` | `Yes` | `200, { <created bucketlist item object> }` |
| `PUT` | `bucketlists:bucketlistId/items:itemId` | `{ itemName, itemDescription, itemUpdateDate }` | `Yes` | `200, { <updated bucketlist item object> }` |
| `DELETE` | `bucketlists:bucketlistId/items:itemId` | None | `Yes` | `200, { message: "Successfully removed bucketlist item." }` |