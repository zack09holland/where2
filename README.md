# WHERE2
Where2 is an aggregation based search engine for locating Restaurants and Events for an upcoming vacation.  The original plan was to build an application that would allow clients to plan their trip in advance favoriting places they wanted to visit while out of town.

## Website:
[Where2](https://hollyw00d.github.io/group-project1-uw-coding-bootcamp/)

### How-To:
Steps for Using the Site:
1. Select a Start Date (the application will default to Today)
2. Select an End Date (the application will default to 7 Days from Today)
3. Enter a Destination: City around the World (this is backed by Google Places API - and will only accept known Google Locations)
4. Select a Search Radius (default is 10 Miles; Up to 100 Miles by 10 mile increments)
5. Click Search...
*Please Note:* Login features with Email does work but is not fully integrated with Favorite Feature

### Technologies Used:
- Google Places - API \ Library - Used for Destination Resolution - Reduces chances of unresolved locations
- Firebase Auth and UI - Site supports User Authentication via Email Provider and utilizs the Firebase UI
- Firebase Database - Site is backed by Firebase for User Favorites Tracking
  - * When User is Authenticated - User Account created for Favorites in Realtime Database *
- Bootstrap - Primary CSS - Modal, Accordian, Carousel, Grid, Button, Form Control
- Moment JS - Used for the Eventbrite API to format Time properly for queries
- Yelp API - Used for Restaurant Results
- Zomato API - Used for Restaurant Results - Had plans to use thier other API's for Restaurant Results
- Eventbrite API - Used to collect Events for a location

### Contributions:
- Craig Wilkey [GitHub Profile](https://github.com/devcwilkey)
  - Project Planning (in the beginning): Once the idea was established; I helped to drive the list of work items we would need to get a framework started.  
  - Initial Website Tempalte with Firebase and Javascript: Utilized my Default Template for creating our Site.
  - Created the initial DEV Experience - Form Boxes for a client to Submit and the Javascript Object for storing these values - This enabled each person to work off the same base for their API investigations.
  - Zomato API: Initially responsible for working with the Zomato API to determine if our planned input would provide an appropriate output.
  - Enabled Firebase Authentication for user login to site.
  - Enabled Firebase Database to enable user Favorites.
    - *Scrapped* Favorites solution due to time and current state of bugs.
  - Javascript as an Object; tried to use an Object for everything but it slowly got out of control
  - Overhauled the Card Print feature that was per API to be a single Function for all Cards to be Printed with.
  - Worked with Suzanne on implementing a fix for Zomato API where image URLs were blank
  - Worked closely with Zach on issues as we were stuck with API or UI design problems.
  - Lot's of Bug Fixes





