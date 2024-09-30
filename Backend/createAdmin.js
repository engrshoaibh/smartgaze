const mongoose = require('mongoose');
const User = require('./models/User');

// Function to create an admin user
const createAdmin = async () => {
  try {
    const dbUri = 'mongodb+srv://ayeshanazneen13:XhZG8ePPbJ2M6cHo@cluster-smartgaze.ay6gx.mongodb.net/';

    // Connect to MongoDB
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Define the admin user details
    const adminDetails = {
      name: 'Abdullah Awan',
      email: 'abdullahawan1705@gmail.com',
      phoneNumber: '1234567890',
      password: 'abdullah',  // This will be hashed before saving
      role: 'admin',
      profilePic: '',  // Optional field
      rollno: 'admin-001', // Ensure this is unique
    };

    // Create a new admin user instance
    const adminUser = new User(adminDetails);
    
    console.log('Admin user object:', adminUser); // Log the user object

    // Save the admin user to the database
    await adminUser.save();
    console.log('Admin user created successfully!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    process.exit(0);  // Exit script
  }
};

// Run the function to create an admin user
createAdmin();
