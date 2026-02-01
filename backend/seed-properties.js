const mongoose = require("mongoose");
require("dotenv").config();

const Property = require("./models/Property");
const Lead = require("./models/Lead");
const User = require("./models/User");
const Category = require("./models/Category");

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/elite-propconnect";

const properties = [
  {
    slug: "sky-gardens",
    name: "Sky Gardens",
    location: "Mumbai",
    type: "apartment",
    price: 12000000,
    priceText: "₹ 1.2 Cr+",
    bhk: "3 BHK",
    rating: 4.8,
    category: "Metro Apartments",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    description: "Sky Gardens is a premium residential project offering luxurious 3 BHK apartments in the heart of Mumbai. With world-class amenities and stunning city views, this is the perfect place to call home.",
    amenitiesCount: 45,
    reraApproved: true,
    developer: "Elite Developers",
    possession: "Dec 2025",
    galleryImages: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    amenities: ["Swimming Pool", "Gymnasium", "Clubhouse", "Children's Play Area", "Jogging Track", "24/7 Security", "Power Backup", "Covered Parking", "Landscaped Gardens", "Indoor Games"],
    floorPlans: [
      { type: "2 BHK", area: "1050 sq.ft", price: "₹ 95 Lakhs", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "3 BHK", area: "1450 sq.ft", price: "₹ 1.2 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { type: "3 BHK Premium", area: "1750 sq.ft", price: "₹ 1.5 Cr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
    ],
    highlights: ["Close to Metro Station", "Premium Clubhouse", "RERA Approved", "Vastu Compliant"],
  },
  {
    slug: "green-valley",
    name: "Green Valley",
    location: "Pune",
    type: "villa",
    price: 25000000,
    priceText: "₹ 2.5 Cr+",
    bhk: "4 BHK",
    rating: 4.9,
    category: "Luxury Villas",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    description: "Green Valley offers exclusive luxury villas surrounded by lush greenery in Pune. Each villa features private gardens, modern architecture, and premium finishes throughout.",
    amenitiesCount: 60,
    reraApproved: true,
    developer: "Green Homes Pvt Ltd",
    possession: "Mar 2026",
    galleryImages: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    ],
    amenities: ["Private Garden", "Swimming Pool", "Home Theatre", "Gymnasium", "Tennis Court", "Spa & Sauna", "Concierge Service", "Wine Cellar", "Rooftop Lounge", "Smart Home System"],
    floorPlans: [
      { type: "3 BHK Villa", area: "2200 sq.ft", price: "₹ 1.8 Cr", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "4 BHK Villa", area: "3000 sq.ft", price: "₹ 2.5 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { type: "5 BHK Villa", area: "4000 sq.ft", price: "₹ 3.5 Cr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
    ],
    highlights: ["Gated Community", "Private Gardens", "Smart Home Enabled", "Near IT Park"],
  },
  {
    slug: "urban-heights",
    name: "Urban Heights",
    location: "Bangalore",
    type: "apartment",
    price: 7500000,
    priceText: "₹ 75 Lakhs+",
    bhk: "2 BHK",
    rating: 4.7,
    category: "Affordable Homes",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    description: "Urban Heights brings affordable luxury to Bangalore with well-designed 2 BHK apartments. Located near major tech parks, it offers great connectivity and modern amenities.",
    amenitiesCount: 30,
    reraApproved: true,
    developer: "Urban Builders",
    possession: "Jun 2025",
    galleryImages: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    amenities: ["Swimming Pool", "Gymnasium", "Children's Play Area", "Jogging Track", "Multi-purpose Hall", "24/7 Security", "Power Backup", "Covered Parking"],
    floorPlans: [
      { type: "1 BHK", area: "650 sq.ft", price: "₹ 45 Lakhs", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
      { type: "2 BHK", area: "950 sq.ft", price: "₹ 75 Lakhs", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "3 BHK", area: "1300 sq.ft", price: "₹ 1.05 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
    ],
    highlights: ["Near Tech Park", "Metro Connectivity", "Affordable Pricing", "RERA Approved"],
  },
  {
    slug: "ocean-view",
    name: "Ocean View",
    location: "Mumbai",
    type: "penthouse",
    price: 35000000,
    priceText: "₹ 3.5 Cr+",
    bhk: "5 BHK",
    rating: 4.9,
    category: "Premium Penthouses",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    description: "Ocean View offers ultra-premium penthouses with panoramic sea views. Experience the epitome of luxury living with private terraces, infinity pools, and bespoke interiors.",
    amenitiesCount: 75,
    reraApproved: true,
    developer: "Prestige Group",
    possession: "Sep 2026",
    galleryImages: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=800&q=80",
    ],
    amenities: ["Private Infinity Pool", "Sky Lounge", "Private Elevator", "Home Automation", "Wine Room", "Private Terrace", "Helipad Access", "Concierge", "Valet Parking", "Rooftop Garden"],
    floorPlans: [
      { type: "4 BHK Penthouse", area: "3500 sq.ft", price: "₹ 2.8 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { type: "5 BHK Penthouse", area: "4500 sq.ft", price: "₹ 3.5 Cr", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "5 BHK Duplex", area: "5500 sq.ft", price: "₹ 5.0 Cr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
    ],
    highlights: ["Sea Facing", "Private Pool", "Ultra Premium", "Celebrity Architect"],
  },
  {
    slug: "riverside-homes",
    name: "Riverside Homes",
    location: "Pune",
    type: "apartment",
    price: 9000000,
    priceText: "₹ 90 Lakhs+",
    bhk: "2 BHK",
    rating: 4.6,
    category: "Riverside Living",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    description: "Riverside Homes offers serene riverside apartments with stunning water views. Located in a peaceful neighborhood, enjoy nature while being connected to the city.",
    amenitiesCount: 35,
    reraApproved: true,
    developer: "Riverside Developers",
    possession: "Jan 2026",
    galleryImages: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80",
    ],
    amenities: ["Riverside Walk", "Swimming Pool", "Yoga Deck", "Gymnasium", "Cycling Track", "Meditation Room", "BBQ Area", "Mini Theatre", "Library", "24/7 Security"],
    floorPlans: [
      { type: "2 BHK", area: "1050 sq.ft", price: "₹ 90 Lakhs", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "2 BHK Premium", area: "1200 sq.ft", price: "₹ 1.1 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { type: "3 BHK", area: "1500 sq.ft", price: "₹ 1.4 Cr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
    ],
    highlights: ["River Facing", "Low Density", "Eco Friendly", "RERA Approved"],
  },
  {
    slug: "palm-villas",
    name: "Palm Villas",
    location: "Goa",
    type: "villa",
    price: 18000000,
    priceText: "₹ 1.8 Cr+",
    bhk: "3 BHK",
    rating: 4.8,
    category: "Beach Villas",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    description: "Palm Villas brings tropical luxury living to Goa with stunning beach-side villas. Perfect as a vacation home or primary residence, each villa offers private pools and lush gardens.",
    amenitiesCount: 50,
    reraApproved: true,
    developer: "Goa Premium Homes",
    possession: "Apr 2026",
    galleryImages: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    amenities: ["Private Pool", "Beach Access", "Spa & Wellness", "Open-air Restaurant", "Water Sports", "Infinity Pool", "Kids Club", "Amphitheatre", "Organic Garden", "Pet Friendly Zone"],
    floorPlans: [
      { type: "2 BHK Villa", area: "1800 sq.ft", price: "₹ 1.2 Cr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
      { type: "3 BHK Villa", area: "2500 sq.ft", price: "₹ 1.8 Cr", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
      { type: "4 BHK Villa", area: "3200 sq.ft", price: "₹ 2.5 Cr", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
    ],
    highlights: ["Beach Side", "Private Pool", "Rental Income Potential", "Tourist Hotspot"],
  },
];

async function seedProperties() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing properties
    await Property.deleteMany({});
    console.log("Cleared existing properties");

    // Insert new properties
    const inserted = await Property.insertMany(properties);
    console.log(`\n✓ Seeded ${inserted.length} properties successfully!\n`);

    inserted.forEach((p) => {
      console.log(`  - ${p.name} (/${p.slug})`);
    });

    // Seed admin user
    const existingAdmin = await User.findOne({ username: "admin" });
    if (!existingAdmin) {
      await User.create({ username: "admin", password: "admin123", role: "admin" });
      console.log("\n✓ Admin user created (admin / admin123)");
    } else {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("\n✓ Admin user updated with admin role");
    }

    // Seed sample leads
    await Lead.deleteMany({});
    const sampleLeads = [
      { name: "Rajesh Kumar", email: "rajesh@example.com", phone: "+91 98765 43210", propertySlug: "sky-gardens", propertyName: "Sky Gardens", type: "visit", date: "2026-02-10", time: "10:00 AM", status: "new" },
      { name: "Priya Sharma", email: "priya@example.com", phone: "+91 87654 32109", propertySlug: "green-valley", propertyName: "Green Valley", type: "brochure", status: "new" },
      { name: "Amit Patel", email: "amit@example.com", phone: "+91 76543 21098", propertySlug: "ocean-view", propertyName: "Ocean View", type: "visit", date: "2026-02-15", time: "02:00 PM", status: "contacted" },
      { name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 65432 10987", propertySlug: "palm-villas", propertyName: "Palm Villas", type: "brochure", status: "new" },
      { name: "Vikram Singh", email: "vikram@example.com", phone: "+91 54321 09876", propertySlug: "urban-heights", propertyName: "Urban Heights", type: "visit", date: "2026-02-12", time: "11:00 AM", status: "converted" },
    ];
    await Lead.insertMany(sampleLeads);
    console.log(`✓ Seeded ${sampleLeads.length} sample leads`);

    // Seed categories
    await Category.deleteMany({});
    const defaultCategories = [
      "Metro Apartments", "Luxury Villas", "Affordable Homes",
      "Premium Penthouses", "Riverside Living", "Beach Villas", "New Launch",
    ];
    await Category.insertMany(defaultCategories.map((name) => ({ name, status: "active" })));
    console.log(`✓ Seeded ${defaultCategories.length} categories`);

    console.log("\nAll data seeded successfully.");
  } catch (error) {
    console.error("Seed Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
  }
}

seedProperties();
