# 💎 ZINORA – Full-Stack Jewellery E-commerce Website

### ✨ A Complete Online Jewellery Shopping & Management Platform

ZINORA is a full-stack jewellery e-commerce web application developed as a team project for a client who wanted to sell and manage jewellery products online.
The project includes a customer-facing shopping website and a dedicated admin dashboard for managing products, categories, customers, orders, payments, inventory, coupons, and other e-commerce operations.
Our goal is to provide customers with a smooth online shopping experience while enabling the business owner to manage essential e-commerce activities through a centralized dashboard.

---

## 🚀 Project Overview

**Project Name:** ZINORA

**Project Type:** Full-Stack Jewellery E-commerce Website

**Development Approach:** Team-Based Development

**Frontend:** React.js

**Backend:** Python and Django

**Database:** MySQL

**API Communication:** REST APIs

ZINORA allows customers to browse jewellery collections, search for products, manage wishlists and shopping carts, enter delivery addresses, and place orders.

The admin dashboard provides a centralized interface for managing the store's products, categories, customers, orders, inventory, and other supported operations.

### 🎯 Project Objectives

* Develop an attractive and user-friendly jewellery shopping website.
* Provide organized jewellery collections and product filtering.
* Implement customer registration and login.
* Integrate frontend functionality with a Django backend.
* Store application data in a MySQL database.
* Provide an admin dashboard for e-commerce management.
* Support order processing and order-status management.
* Practice collaborative development using Git and GitHub.

---

## ✨ Key Features

### 🛍️ Customer Website

* User registration and login.
* Responsive jewellery shopping interface.
* Home page and dedicated jewellery collections.
* Product browsing and search.
* Product filtering based on available criteria.
* Wishlist functionality.
* Shopping cart.
* Checkout and delivery-address management.
* Online payment and Cash on Delivery (COD) options.
* Order confirmation and Order ID.
* Order tracking and order history.
* Customer profile management.
* Customer support interface.

### ⚙️ Admin Dashboard

* Dashboard analytics and business overview.
* Product management.
* Category management.
* Customer management.
* Order management.
* Payment management.
* Coupons and offers.
* Inventory monitoring.
* Admin profile and settings.
* Order-related notifications.
* Customer support management.
* Direct access to the customer website.
* CRUD operations across applicable management modules.

---

## 💎 Customer Website

The customer-facing website is designed to provide an organized and convenient jewellery shopping experience.

### 1. User Registration and Login

Customers can register for an account and log in to access the shopping website and their account-related features.

### 2. Home Page and Jewellery Collections

The website organizes jewellery products into dedicated collections, including:

* Home
* New Arrivals
* Necklaces and Chokers
* Earrings and Jhumkas
* Bangles and Kadas
* Rings and Pendants
* Bridal and Festive Collections
* Offers
* Budget Collections
* All Collections

### 3. Search and Filtering

Customers can browse products and use available search and filtering options to find jewellery according to their preferences.

### 4. Wishlist and Shopping Cart

Customers can save favourite products to their wishlist and add selected products to the shopping cart before checkout.

### 5. Checkout and Delivery Address

Customers can enter their delivery details and proceed with the order-placement process.

### 6. Payment Options

The website provides payment options for:

* Online Payment
* Cash on Delivery (COD)

Payment processing and status handling depend on the configured payment functionality.

### 7. Order Confirmation and Tracking

After successfully placing an order, the customer can receive order confirmation information, including a unique Order ID.

Order tracking and status information help customers follow their order progress.

### 8. Customer Profile

The customer profile includes sections for:

* Overview
* My Profile
* My Addresses
* My Orders

Customers can manage their profile information, delivery addresses, and order details.

### 9. Customer Support

The website provides a customer support interface for assistance and queries.

---

## 🛠️ Admin Dashboard

The admin dashboard provides centralized access to the main store-management modules.

### 📊 1. Dashboard Overview

The dashboard presents key business indicators, including supported metrics such as:

* Total Orders
* Total Revenue
* Total Products
* Total Customers
* Pending Orders
* Delivered Orders
* Low-Stock Products
* Active Products

### 📦 2. Product Management

Administrators can manage jewellery products through the product-management interface.

Supported operations include:

* Adding products.
* Viewing product details.
* Updating product information.
* Deleting products.
* Managing prices and availability.
* Displaying products on the customer website.

### 🗂️ 3. Category Management

The category module helps organize jewellery products into appropriate collections.

Administrators can manage categories and associate products with relevant jewellery collections.

### 👥 4. Customer Management

The customer-management module provides access to customer records and supported account information, including:

* Customer names.
* Email addresses.
* Phone numbers.
* Available address details.
* Registration information.
* Account status.

### 🛍️ 5. Order Management

Administrators can view and manage customer orders.

Key functionality includes:

* Viewing order details.
* Accessing customer information.
* Viewing delivery addresses.
* Monitoring order status.
* Updating the order through supported processing stages.

Typical order statuses include:

`Placed → Confirmed → Processing → Shipped → Delivered`

Orders may also be cancelled where supported.

### 💳 6. Payment Management

The payment-management module provides access to payment information and supported payment statuses.

Examples include:

* Pending
* Paid
* Failed
* Refunded

The availability of specific payment statuses depends on the implemented payment workflow.

### 🎟️ 7. Coupons and Offers

The coupons and offers module supports the management of discount coupons and promotional offers.

### 📦 8. Inventory Management

The inventory module helps administrators monitor stock availability.

Typical inventory categories include:

* In Stock
* Low Stock
* Out of Stock

### ⚙️ 9. Settings

The settings module provides access to supported admin account information and account-management options.

### 🔔 10. Notifications and Customer Support

The dashboard includes interfaces for order-related notifications and customer support management, depending on the configured backend functionality.

### 🌐 11. View Customer Website

Administrators can open the main customer website directly from the dashboard to review the shopping experience.

### 🔄 12. CRUD Operations

Create, Read, Update, and Delete operations are implemented across applicable management modules to support efficient data management.

---

## 🧰 Technology Stack

ZINORA uses modern frontend and backend technologies to deliver a database-driven e-commerce application.

### 💻 Frontend Technologies

| Technology        | Purpose                                       |
| ----------------- | --------------------------------------------- |
| React.js          | Component-based user interface                |
| JavaScript ES6+   | Application logic and interactivity           |
| HTML5             | Webpage structure                             |
| CSS3              | Styling and layout                            |
| Material UI (MUI) | UI components and interface design            |
| React Router DOM  | Client-side routing                           |
| Vite              | Frontend development server and build tooling |

### ⚙️ Backend Technologies

| Technology | Purpose                                    |
| ---------- | ------------------------------------------ |
| Python     | Backend programming language               |
| Django     | Backend framework                          |
| REST APIs  | Communication between frontend and backend |
| Django ORM | Database queries and model management      |

### 🗄️ Database Technologies

| Technology      | Purpose                                      |
| --------------- | -------------------------------------------- |
| MySQL           | Relational database                          |
| MySQL Workbench | Database administration and query management |

### 🔐 Authentication and Authorization

* Django authentication.
* Token-based API authentication.
* Role-based access control for administrators and customers.
* Protected API endpoints where configured.

### 🧑‍💻 Development Tools

* Visual Studio Code
* Git
* GitHub
* MySQL Workbench
* Python virtual environment

---

### Application Workflow


              CUSTOMER / ADMIN
                     |
                     v
            React.js Frontend
                     |
                     v
              REST API Requests
                     |
                     v
             Django Backend
                     |
                     v
                Django ORM
                     |
                     v
               MySQL Database



## 🔐 Authentication and Security

Authentication and authorization help control access to different parts of the application.

ZINORA includes functionality for customer and admin access through the configured authentication system.

Security considerations include:

* Protecting admin-only API endpoints.
* Validating user input.
* Using appropriate authentication headers.
* Keeping database credentials private.
* Storing secrets in environment variables.
* Using HTTPS in production.
* Configuring Django's production security settings before deployment.


## 🏆 GitHub Achievements

During my GitHub journey, I unlocked achievements such as:

* 🦈 **Pull Shark** — recognizing qualifying pull request activity.
* 🏅 **YOLO (Bronze)** — recognizing qualifying pull request merges without code review.

These achievements encourage continued collaboration, practical development, and learning through real-world projects.

GitHub profile:

https://github.com/muskan1234-wq

---

## 👩‍💻 Team Members

ZINORA was developed collaboratively by our team.

###  Team Leader and Developer

**Muskan Pathan**

### 💻 Development Team

* Jyoti Turbe
* Vidyashri Chendake
* Pratiksha Aware
* Rutuja Mane
* Basavaraj Maddi

### 🎨 Website Designer and Tester

* Krushna Munde

We collaborated to build the application, work on its features, solve development challenges, and improve our practical software development skills.

---

## 🚀 Future Enhancements

Potential future improvements include:

* Deployment to a production hosting environment.
* Improved mobile responsiveness and accessibility.
* Advanced product search and filtering.
* Email and SMS order notifications.
* Enhanced order tracking.
* Payment gateway integration and verification.
* Automated inventory updates.
* Product reviews and ratings.
* Analytics and sales reports.
* Automated testing and continuous integration.

These are potential enhancements and may not be implemented in the current version.

---

## 📚 Learning Outcomes

Working on ZINORA provided practical experience in:

* Full-stack web development.
* React component development.
* Django backend development.
* REST API integration.
* MySQL database management.
* Django ORM and database migrations.
* Authentication and authorization.
* E-commerce workflows.
* Git version control and GitHub collaboration.
* Team coordination and problem-solving.

This project represents an important milestone in our journey toward building practical, real-world software applications.

---

## 🔗 Repository

**GitHub Repository:**

https://github.com/muskan1234-wq/zinora_project

**GitHub Profile:**

https://github.com/muskan1234-wq

---

##  Acknowledgements

A big thank you to every team member for their dedication, creativity, collaboration, and support throughout the project.

ZINORA reflects our commitment to learning, teamwork, and transforming an idea into a practical full-stack web application.

**Keep Learning. Keep Building. Keep Growing! 🚀**

---

⭐ If you find this project interesting, consider exploring the repository and following our development journey.
