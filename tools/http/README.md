# .http files

## REST Client for VS Code

The **REST Client** extension for Visual Studio Code allows users to send HTTP requests and view responses directly within the editor, streamlining the API testing process. It supports **dotenv** files, enabling the use of environment variables for dynamic request configurations, which enhances flexibility and organization in managing different environments. Additionally, the extension provides a clear view of responses, complete with syntax highlighting and the ability to save raw responses, making it easier to analyze and debug API interactions.

(1) REST Client - Visual Studio Marketplace. https://marketplace.visualstudio.com/items?itemName=humao.rest-client.

## Request a Bearer Token from Akeneo

To make a request to Akeneo for credentials, you'll typically need to send an HTTP POST request to their authentication endpoint. Here’s a basic outline of the steps:

1. **Set Up Your Request**: Use the REST Client in Visual Studio Code to create a new request file. You'll need to specify the URL for the Akeneo API authentication endpoint.

2. **Include Your Credentials**: In the request body, include your client ID and secret, usually in JSON format. For example:

   ```json
   {
     "grant_type": "password",
     "client_id": "{{AKENEO_CLIENTID}}",
     "client_secret": "{{AKENEO_SECRET}}",
     "username": "{{AKENEO_USER}}",
     "password": "{{AKENEO_PWD}}"
   }
   ```

3. **Send the Request**: Execute the request and check the response. If successful, you should receive an access token that you can use for subsequent API calls.

## Request products from Akeneo

To request a list of products from Akeneo using the REST Client extension in Visual Studio Code, follow these steps:

1. **Authenticate**: First, ensure you have obtained your access token by making the authentication request as described earlier.

2. **Create a New Request**: In your request file, set up a new GET request to the Akeneo API endpoint for products. The URL typically looks like this:

   ```
   GET https://your-akeneo-instance.com/api/rest/v1/products
   ```

3. **Add Authorization Header**: Include the access token in the headers to authenticate your request. Your request should look something like this:

   ```http
   GET https://your-akeneo-instance.com/api/rest/v1/products
   Authorization: Bearer your_access_token
   ```

4. **Send the Request**: Execute the request in the REST Client. You should receive a response containing the list of products in JSON format.

5. **Review the Response**: The response will include product details, which you can analyze directly in VS Code.
