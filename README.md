# Forex Exchange Web Application

Welcome to the Forex Exchange Web Application! This application allows users to perform currency conversions, access historical exchange rate data, and get the latest exchange rates. Whether you're a traveler, a business owner, or simply curious about currency exchange rates, this app has got you covered.

## Features

### Currency Conversion

Easily convert between different currencies with our user-friendly currency conversion tool. Input the amount you want to convert, select the source currency, and choose the target currency. The app will provide you with the converted amount instantly, using real-time exchange rate data.

### Historical Exchange Rate Data

Get access to historical exchange rate data to analyze trends and patterns. The application fetches historical exchange rates for a specified time period, allowing users to visualize and understand currency fluctuations over time.

### Real-Time Exchange Rates

Stay updated with the latest exchange rates for a wide range of currencies. The app provides up-to-date exchange rates based on the latest market data, ensuring that you always have the most accurate information at your fingertips.

## Technologies Used

- **Node.js**: The application's backend is built using Node.js, providing a robust and scalable foundation.
- **Express.js**: Express.js is used to create a fast and efficient web server that handles API requests and serves HTML views.
- **MongoDB**: MongoDB is used to store historical exchange rate data and other relevant information.
- **Redis**: Redis is used to cache frequently accessed data, reducing response times and improving performance.
- **JWT**: (JSON Web Tokens): JWT is used for user authentication and authorization, enhancing the security of the application.
- **Handlebars (hbs)**: Handlebars is used as the templating engine for rendering HTML views on the server.

## Installation and Setup

1. **Clone the repository:**

    ```bash
    [git clone https://github.com/YourUsername/forexexchangeapp.git](https://github.com/Hrshw/forexexchange.git)
    ```

2. **Install dependencies:**

    ```bash
    cd forexexchange
    npm install
    ```

3. **Set up environment variables:**

    - Create a `.env` file in the root directory.
    - Add the following environment variables:

      ```makefile
      MONGODB_URI=<your_mongodb_uri>
      API_KEY=<your_openexchangerates_APP_ID>
      REDIS_HOST=<your_redis_host>
      REDIS_PORT=<your_redis_port>
      ```

4. **Start the application:**

    ```bash
    node index.js
    ```

5. **Access the application:**

    Open your browser and go to [http://localhost:3000](http://localhost:3000).
   
- You can also access the application online at: [https://victorious-tan-haddock.cyclic.cloud/](https://victorious-tan-haddock.cyclic.cloud/)

## License

This project is licensed under the MIT License.
