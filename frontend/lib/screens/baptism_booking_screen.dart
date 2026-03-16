import 'package:flutter/material.dart';

class BaptismBookingScreen extends StatefulWidget {
  const BaptismBookingScreen({super.key});

  @override
  State<BaptismBookingScreen> createState() => _BaptismBookingScreenState();
}

class _BaptismBookingScreenState extends State<BaptismBookingScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _childNameController = TextEditingController();
  final TextEditingController _dobController = TextEditingController();
  final TextEditingController _parentsController = TextEditingController();
  final TextEditingController _godparentsController = TextEditingController();
  final TextEditingController _contactController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();
  final TextEditingController _preferredParishController = TextEditingController();
  final TextEditingController _preferredDateController = TextEditingController();
  final TextEditingController _preferredTimeController = TextEditingController();
  final TextEditingController _preferredPriestController = TextEditingController();
  final TextEditingController _paymentNotesController = TextEditingController();

  @override
  void dispose() {
    _childNameController.dispose();
    _dobController.dispose();
    _parentsController.dispose();
    _godparentsController.dispose();
    _contactController.dispose();
    _notesController.dispose();
    _preferredParishController.dispose();
    _preferredDateController.dispose();
    _preferredTimeController.dispose();
    _preferredPriestController.dispose();
    _paymentNotesController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Booking Submitted"),
          content: const Text(
              "Your baptism booking request has been submitted. Parish will confirm availability."),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text("OK"),
            )
          ],
        ),
      );
    }
  }

  Widget _buildSection({required String title, required List<Widget> children}) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue)),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Baptism Booking"),
        leading: TextButton.icon(
          onPressed: () {
            Navigator.of(context).pop(); // Back to Home
          },
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          label: const Text(
            "Home",
            style: TextStyle(color: Colors.white),
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Fill out the form below to submit your booking request. All fields marked with * are required.",
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 5),
              const Text(
                "Subject to availability. Parish will confirm your booking and selected priest.",
                style: TextStyle(
                    fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
              ),
              const SizedBox(height: 20),

              // Child Info Section
              _buildSection(title: "Child Information", children: [
                TextFormField(
                  controller: _childNameController,
                  decoration: const InputDecoration(
                    labelText: "Child's Full Name *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _dobController,
                  decoration: const InputDecoration(
                    labelText: "Date of Birth *",
                    hintText: "YYYY-MM-DD",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                  onTap: () async {
                    FocusScope.of(context).requestFocus(FocusNode());
                    DateTime? pickedDate = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime.now(),
                    );
                    if (pickedDate != null) {
                      _dobController.text =
                          "${pickedDate.year}-${pickedDate.month}-${pickedDate.day}";
                    }
                  },
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Implement file picker
                  },
                  icon: const Icon(Icons.upload_file),
                  label: const Text("Upload Birth Certificate *"),
                ),
              ]),

              // Parents Info Section
              _buildSection(title: "Parents / Godparents", children: [
                TextFormField(
                  controller: _parentsController,
                  decoration: const InputDecoration(
                    labelText: "Parents' Names *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _godparentsController,
                  decoration: const InputDecoration(
                    labelText: "Godparents' Details *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contactController,
                  decoration: const InputDecoration(
                    labelText: "Contact Number / Email *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                ),
              ]),

              // Booking Preferences
              _buildSection(title: "Booking Preferences", children: [
                TextFormField(
                  controller: _preferredParishController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Parish *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _preferredDateController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Baptism Date *",
                    hintText: "YYYY-MM-DD",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                  onTap: () async {
                    FocusScope.of(context).requestFocus(FocusNode());
                    DateTime? pickedDate = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (pickedDate != null) {
                      _preferredDateController.text =
                          "${pickedDate.year}-${pickedDate.month}-${pickedDate.day}";
                    }
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _preferredTimeController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Time Slot *",
                    hintText: "HH:MM",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) =>
                      value == null || value.isEmpty ? "Required" : null,
                  onTap: () async {
                    FocusScope.of(context).requestFocus(FocusNode());
                    TimeOfDay? pickedTime = await showTimePicker(
                      context: context,
                      initialTime: TimeOfDay.now(),
                    );
                    if (pickedTime != null) {
                      _preferredTimeController.text =
                          "${pickedTime.hour}:${pickedTime.minute}";
                    }
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _preferredPriestController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Priest (Optional) - Subject to availability",
                    border: OutlineInputBorder(),
                  ),
                ),
              ]),

              // Additional Notes
              _buildSection(title: "Additional Information", children: [
                TextFormField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    labelText: "Additional Notes",
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
              ]),

              // Payment Section
              _buildSection(title: "Payment Information", children: [
                ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Implement file picker for payment proof
                  },
                  icon: const Icon(Icons.upload_file),
                  label: const Text("Upload Proof of Payment *"),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _paymentNotesController,
                  decoration: const InputDecoration(
                    labelText: "Additional Information",
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 2,
                ),
              ]),

              const SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: _submitForm,
                  style: ElevatedButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(vertical: 14, horizontal: 28),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text("Submit Booking", style: TextStyle(fontSize: 16)),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}