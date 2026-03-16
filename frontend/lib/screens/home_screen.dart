import 'package:flutter/material.dart';

// Entry Point
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Diocese Booking System',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomeScreen(),
    );
  }
}

// Home Screen
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  final List<Map<String, String>> services = const [
    {
      "title": "Baptism",
      "desc": "Book a baptism ceremony for your child",
      "icon": "assets/icons/baptism.png",
    },
    {
      "title": "Wedding",
      "desc": "Schedule your sacred matrimony ceremony",
      "icon": "assets/icons/wedding.png",
    },
    {
      "title": "Confirmation",
      "desc": "Book confirmation for strengthening faith",
      "icon": "assets/icons/confirmation.png",
    },
    {
      "title": "Eucharist (First Communion)",
      "desc": "Schedule first holy communion ceremony",
      "icon": "assets/icons/eucharist.png",
    },
    {
      "title": "Reconciliation (Confession)",
      "desc": "Book a time for confession",
      "icon": "assets/icons/reconciliation.png",
    },
    {
      "title": "Anointing the Sick",
      "desc": "Request anointing for the sick",
      "icon": "assets/icons/anointing.png",
    },
    {
      "title": "Mass Intentions",
      "desc": "Submit a mass intention request",
      "icon": "assets/icons/mass_intention.png",
    },
    {
      "title": "Funeral Mass",
      "desc": "Arrange a funeral mass service",
      "icon": "assets/icons/funeral_mass.png",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Diocese Booking System"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text(
              "Welcome to Diocese Booking System",
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            const Text(
              "Book sacraments and mass intentions across all parishes in the diocese.\nSelect a service below to begin your booking request.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 30),
            Expanded(
              child: ListView(
                children: [
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: services.length,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 20,
                      mainAxisSpacing: 20,
                      childAspectRatio: 1.4,
                    ),
                    itemBuilder: (context, index) {
                      final service = services[index];
                      return InkWell(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => ServiceDetailScreen(
                                  serviceTitle: service["title"]!),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 40,
                                width: 40,
                                color: Colors.black, // Placeholder for icon
                              ),
                              const SizedBox(height: 15),
                              Text(
                                service["title"]!,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                service["desc"]!,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 30),
                  // How It Works Section (Centered Text)
                  const Center(
                    child: Text(
                      "How It Works",
                      style:
                          TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: const [
                      Text(
                        "#1 Select Sacraments/Services",
                        style:
                            TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 5),
                      Text(
                        "Select Sacrament/Service",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 3),
                      Text(
                        "Choose the sacrament or service you wish to book",
                        style: TextStyle(fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 15),
                      Text(
                        "#2 Fill Details",
                        style:
                            TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 5),
                      Text(
                        "Complete Booking Form",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 3),
                      Text(
                        "Complete the booking form with required information",
                        style: TextStyle(fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 15),
                      Text(
                        "#3 Await Confirmation",
                        style:
                            TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 5),
                      Text(
                        "Confirmation",
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 3),
                      Text(
                        "Parish staff will review and confirm your booking",
                        style: TextStyle(fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 30),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Placeholder Service Detail Page
class ServiceDetailScreen extends StatelessWidget {
  final String serviceTitle;
  const ServiceDetailScreen({super.key, required this.serviceTitle});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(serviceTitle),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'This is the $serviceTitle page.\nYou can add booking form here.',
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}