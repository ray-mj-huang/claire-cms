# PRD

## Goal
Build a personal blog website with an admin editor functionality. The blog owner can edit the website through admin editor tools, while visitors can browse various pages.

## Implemented Features
1. **Blog Management System**:
   - Create, read, update posts with a rich text editor
   - Posts have title, content, cover image, tags, and status (draft/published)
   - Admin panel for managing posts
   - Blog listing page and individual post view

2. **Product Management System**:
   - Create, read, update, delete products
   - Products have name, price, description, image, and status
   - Admin panel for managing products
   - Product listing page and individual product view

3. **Payment Integration**:
   - Stripe checkout integration for product purchases
   - Embedded Stripe checkout experience
   - Payment processing with Firebase Cloud Functions

4. **Firebase Integration**:
   - Firestore database for storing posts and products
   - Firebase Storage for image uploads
   - Firebase Authentication for admin access
   - Firebase Cloud Functions for backend processing

5. **Responsive UI with Tailwind CSS**:
   - Modern, responsive design
   - Admin and user-facing layouts

## Core Features
1. Admin Panel: the blog owner can edit whole website and create new pages, including:
  - Navigation Bar: edit button on navigation bar
  - Footer: edit items on the footer
  - Pages: create, edit, remove pages
  - Posts: write, publish, edit, delete posts ✅
  - Products: create, edit, delete products ✅
  - Other settings:
    - tags management of posts ✅
    - website appearance(color theme, font...etc.)
2. Post Editor: the blog owner can write and publish posts with a powerful editor like markdown editor or Rich Text Editor. ✅

## Nice-to-have Features
1. Payment gateway integration: Users can purchase products or services on the website, and complete payment online. ✅
    - integrated with Stripe ✅
2. Booking System: Users can book a service(coaching) within available time in "Services" page
    - Booking system could be integrated with Google Calendar
3. Page Builder: the blog owner can create a customized page simply through dragging and dropping default components including:
    - image
    - text parapraph
    - grid layout

## Pages
1. Homepage as a landing page ✅
    - full-width cover image on the top
    - a brief text content of personal brand, including introduction of this brand, what service it provides, what products it sells.
    - 3-4 sets of "high light", each set has one icon/image and a short sentence.
2. About ✅
    - A picture
    - A paragraph of introduction
3. Blog ✅
    - a overview page which shows all posts ✅
    - a post page for each post ✅
4. Products ✅
    - Show all products, like e-books or online courses. ✅
    - Can link to checkout page to complete payment (integrated with Stripe) ✅
5. Services ✅
    - List all services like consulting or online coaching.
    - Integrated with booking/Scheduling systems. (Not implemented yet)
6. Events ✅
    - List all events upcoming and finished, like webinar or online streaming.
7. Admin ✅
    - It needs to login to access this page.
    - it's a panel for website owner to edit whole website
    - especially, can let owner publish posts and mange posts. ✅
    - manage products ✅

## Components
1. Navigation Bar ✅
    - fixed on the top of page
    - Including buttons navigated to other pages:
        - Home
        - About
        - Blog
        - Products
        - Services
2. Footer ✅
    - on the bottom of page
    - including:
        - buttons navigated to other pages
        - copyright message
3. Post Editor ✅
    - the blog owner can write and publish posts with a powerful editor like markdown editor or Rich Text Editor.

## Other Requirements
- RWD ✅
- User friendly ✅
- SEO friendly

## Tech Stacks
1. front end: React / Tailwind ✅
2. database: Firebase Firestore ✅
3. hosting: Firebase Hosting ✅
4. payment: Stripe ✅

## Data Structure

### Blog Post
```typescript
{
  id: string;              // Auto-generated document ID
  title: string;           // Post title
  content: string;         // Post content
  coverImage: string;      // URL to cover image
  tags: string[];          // Array of tags
  status: "draft" | "published";
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

### Product
```typescript
{
  id: string;              // Auto-generated document ID
  name: string;            // Product name
  price: number;           // Product price
  description: string;     // Product description
  image: string;           // URL to product image
  status: "active" | "inactive";
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

## Next Steps
1. Implement booking system for services
2. Add page builder functionality
3. Enhance admin settings for website appearance customization
4. Implement SEO optimization features
5. Add analytics dashboard for tracking visitor engagement




