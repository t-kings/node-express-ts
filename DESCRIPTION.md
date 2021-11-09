## Problem Statement:
Build a Node.js server, preferably with Typescript, for managing perishable inventory. The server should be stateless and backed with a relational database.

### Requirements:
1. POST /:item/add 
  - Add a lot of :item to the system
  - IN: {quantity: Number, expiry: Number}
    - quantity - quantity of item in the lot to be added
    - expiry - milliseconds-since-epoch representing the expiry time of this lot
  - OUT: {}
2. POST /:item/sell
- sell a quantity of an item and reduce its inventory from the database.
- IN: {quantity: Number}
  - quantity - quantity to be sold.
- OUT: {}
3. GET /:item/quantity
- get non-expired quantity of the item from the system
- IN: {}
- OUT: {quantity: Number, validTill: Number | null}
  - quantity - non-expired quantity of item
  - validTill - milliseconds-since-epoch representing the maximum time  till which the returned quantity is valid. should be null if returned quantity is 0
Periodically clear the database to remove expired records



### Expectations and Clarifications:
1. Server should be able to handle highly concurrent workloads
Selling should be optimized so that the maximum quantity of an item can be sold across multiple sell-api calls.
2. A sell-api call should not be able to sell a quantity of the item which is more than the non-expired quantity of the item.
3. You should optimize for both readability and performance.
4. Your submission should include comprehensive tests.
5. For the http-server, please use express
6. For the database, please use any relational database
7. For interacting with the database, use whichever tool you prefer
8. Write the code with the same mindset as you would for a real world project
9. The solution should be submitted in the form of a deployed public server and the code should be shared in the form of a gzipped/zipped git repository over email



### Example and Explanation:
Let's say we have 2 items foo & bar. And let's assume an initial starting time t0=1615525981224. We'll go through a series of requests to the system and try to explain how the system should behave.

1. item=foo:
- t=t0, POST /foo/add, IN: {expiry: t0+10000, quantity: 10}, 
  - OUT: {}
- t=t0+5000, GET /foo/quantity, IN: {}, 
  - OUT: {quantity: 10, validTill: t0+10000}
- t=t0+7000, POST /foo/add, IN: {expiry: t0+20000, quantity: 5},
  - OUT: {}
- t=t0+8000, GET /foo/quantity, IN: {}, 
  - OUT: {quantity: 15, validTill: t0+10000}
- t=t0+10000, GET /foo/quantity, IN: {}, 
  - OUT: {quantity: 5, validTill: t0+20000}, 
    - notice how validTill & quantity changed since the lot added in #1 got expired
- t=t0+12000, POST /foo/sell, IN: {quantity: 3}, 
  - OUT: {}
- t=t0+13000, GET /foo/quantity, IN: {}, 
  - OUT: {quantity: 2, validTill: t0+20000}
- t=t0+20000, GET /foo/quantity, IN: {}, 
  - OUT: {quantity: 0, validTill: null}

1. item=bar:

- t=t0, POST /bar/add, IN: {expiry: t0+10000, quantity: 10}, 
	- OUT: {}
- t=t0+1000, POST /bar/add, IN: {expiry: t0+15000, quantity: 10}, 
	- OUT: {}
- t=t0+2000, POST /bar/add, IN: {expiry: t0+20000, quantity: 10}, 
	- OUT: {}
- t=t0+3000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 30, validTill: t0+10000}
- t=t0+5000, POST /bar/sell, IN: {quantity: 5}, 
	- OUT: {}
- t=t0+7000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 25, validTill, t0+10000}
- t=t0+10000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 20, validTill, t0+15000}, notice how the selling that happened in #5 reduced the quantity of the lot which was closest to expiration
- t=t0+13000, POST /bar/sell, IN: {quantity: 13}, 
	- OUT: {}
- t=t0+14000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 7, validTill: t0+20000},  notice how all the quantity of the lot that was closest to expiration got sold (the one added in #2), and the remaining amount got sold from the lot added in #3
- t=t0+17000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 7, validTill: t0+20000}
- t=t0+20000, GET /bar/quantity, IN: {}, 
	- OUT: {quantity: 0, validTill: null}
