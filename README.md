# Bucketlist App API

## Setup
Ensure node and npm are installed on the target machine. \
Install node dependencies with `npm install`. \
Start the server with `node app.js`. \
Test the following endpoints:
| Type | Endpoint | Data | Authorization Required | Expected Response |
| --- | --- | --- | --- | --- | 
| `POST` | `/signup` | `{ email, username, password, confirmPassword }` | `No` | `200, { message: "<username> created successfully." }` |
| `POST` | `/login` | `{ email, password }` | `No` | `200, { message: "Authorization successful. Check session ID named connect.sid in cookies." }` |
| `GET` | `/logout` | None | `No` | `200, { message: "Logged out successfully." }`
| `GET` | `/bucketlists` | None | `Yes` | `200, [ <bucketlist objects> ]` |
| `POST` | `/bucketlists` | `{ bucketlistName, bucketlistDescription, createDate, updateDate }` | `Yes` | `200, { <created bucketlist object> }` |
| `PUT` | `/bucketlists:bucketlistId` | `{ bucketlistName, bucketlistDescription, updateDate }` | `Yes` | `200, { <updated bucketlist object> }` |
| `DELETE` | `/bucketlists:bucketlistId` | None | `Yes` | `200, { message: "Bucketlist deleted successfully." }` |
| `GET` | `/bucketlists:bucketlistId/items` | None | `Yes` | `200, [ <bucketlist item objects> ]` |
| `POST` | `bucketlists:bucketlistId/items` | `{ itemName, itemDescription, itemCreateDate, itemUpdateDate }` | `Yes` | `200, { <created bucketlist item object> }` |
| `PUT` | `bucketlists:bucketlistId/items:itemId` | `{ itemName, itemDescription, itemUpdateDate }` | `Yes` | `200, { <updated bucketlist item object> }` |
| `DELETE` | `bucketlists:bucketlistId/items:itemId` | None | `Yes` | `200, { message: "Bucketlist item deleted successfully." }` |