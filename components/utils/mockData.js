export const mockUserData = {
  recentRides: [
    {
      destination: "Airport Terminal 1",
      date: "Today, 2:30 PM",
      amount: 45.5,
      duration: "35 mins",
      distance: "15.2 miles",
    },
    {
      destination: "Downtown Mall",
      date: "Yesterday, 11:20 AM",
      amount: 22.75,
      duration: "20 mins",
      distance: "8.5 miles",
    },
    {
      destination: "Central Station",
      date: "2 days ago",
      amount: 18.9,
      duration: "15 mins",
      distance: "5.3 miles",
    },
  ],
  stats: {
    totalRides: 42,
    totalSpent: 857,
    avgRating: 4.8,
  },

  role: "passenger",
  name: "Jane Doe",
  token: "1234567890",
}

export const mockDriverData = {
  name: "John Doe",
  avatar: "/placeholder.svg",
  rating: 4.9,
  ridesCompleted: 2543,
  role: "driver",
  token: "1234567890",
  status: "active",
  vehicle: {
    make: "Tesla",
    model: "Model 3",
    year: "2023",
    licensePlate: "ABC 123",
  },
  documents: [
    {
      type: "Driver's License",
      number: "DL123456",
      expiryDate: "2025-12-31",
      status: "approved",
    },
    {
      type: "Vehicle Insurance",
      number: "INS789012",
      expiryDate: "2024-06-30",
      status: "approved",
    },
  ],
  earnings: {
    today: 245,
    week: 1250,
    pending: 89.5,
    stats: {
      completionRate: 98,
      averageRating: 4.9,
      cancellationRate: 2,
    },
  },
  schedule: {
    monday: { active: true, hours: "9:00 AM - 5:00 PM" },
    tuesday: { active: true, hours: "9:00 AM - 5:00 PM" },
    wednesday: { active: true, hours: "9:00 AM - 5:00 PM" },
    thursday: { active: true, hours: "9:00 AM - 5:00 PM" },
    friday: { active: true, hours: "9:00 AM - 5:00 PM" },
    saturday: { active: false, hours: "" },
    sunday: { active: false, hours: "" },
  },
  todayStats: {
    earnings: 245,
    completedRides: 8,
  },
  recentActivity: [
    {
      type: "Airport Dropoff",
      time: "2:30 PM",
      amount: 45.5,
    },
    {
      type: "Downtown Pickup",
      time: "1:15 PM",
      amount: 22.75,
    },
    {
      type: "Shopping Mall",
      time: "11:45 AM",
      amount: 18.9,
    },
  ],
  performance: {
    rating: 4.9,
    acceptance: 95,
    completion: 98,
  },
}


