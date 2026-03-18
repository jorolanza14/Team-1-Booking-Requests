import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class WeddingBookingScreen extends StatefulWidget {
  const WeddingBookingScreen({super.key});

  @override
  State<WeddingBookingScreen> createState() => _WeddingBookingScreenState();
}

class _WeddingBookingScreenState extends State<WeddingBookingScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _groomNameController = TextEditingController();
  final TextEditingController _brideNameController = TextEditingController();
  final TextEditingController _godparentsController = TextEditingController();
  final TextEditingController _contactController = TextEditingController();
  final TextEditingController _preferredParishController = TextEditingController();
  final TextEditingController _preferredDateController = TextEditingController();
  final TextEditingController _preferredTimeController = TextEditingController();
  final TextEditingController _seminarScheduleController = TextEditingController();
  final TextEditingController _preferredPriestController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  // File storage
  List<PlatformFile> _documents = [];

  @override
  void dispose() {
    _groomNameController.dispose();
    _brideNameController.dispose();
    _godparentsController.dispose();
    _contactController.dispose();
    _preferredParishController.dispose();
    _preferredDateController.dispose();
    _preferredTimeController.dispose();
    _seminarScheduleController.dispose();
    _preferredPriestController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  // Pick multiple documents
  Future<void> _pickDocuments() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'png', 'jpeg'],
    );

    if (result != null) {
      setState(() {
        _documents = result.files;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Selected ${result.files.length} document(s)")),
      );
    }
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      if (_documents.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Please upload required documents")),
        );
        return;
      }

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Booking Submitted"),
          content: const Text(
              "Your wedding booking request has been submitted. Parish will confirm availability."),
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
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue),
            ),
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
        title: const Text("Wedding Booking"),
        leading: TextButton.icon(
          onPressed: () {
            Navigator.of(context).pop(); // Back to Home
          },
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          label: const Text("Home", style: TextStyle(color: Colors.white)),
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
                style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.grey),
              ),
              const SizedBox(height: 20),

              // Couple Info
              _buildSection(title: "Couple Information", children: [
                TextFormField(
                  controller: _groomNameController,
                  decoration: const InputDecoration(
                    labelText: "Groom's Full Name *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _brideNameController,
                  decoration: const InputDecoration(
                    labelText: "Bride's Full Name *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
              ]),

              // Documents
              _buildSection(title: "Required Documents", children: [
                ElevatedButton.icon(
                  onPressed: _pickDocuments,
                  icon: const Icon(Icons.upload_file),
                  label: const Text(
                      "Upload Documents (CENOMAR, Birth, Baptismal, Confirmation) *"),
                ),
                const SizedBox(height: 8),
                if (_documents.isNotEmpty)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: _documents
                        .map((file) => Text("• ${file.name}", style: const TextStyle(color: Colors.green)))
                        .toList(),
                  ),
              ]),

              // Godparents
              _buildSection(title: "Godparents & Contact", children: [
                TextFormField(
                  controller: _godparentsController,
                  decoration: const InputDecoration(
                    labelText: "Godparents' Details *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contactController,
                  decoration: const InputDecoration(
                    labelText: "Contact Number / Email *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
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
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _preferredDateController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Wedding Date *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _preferredTimeController,
                  decoration: const InputDecoration(
                    labelText: "Preferred Time Slot *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _seminarScheduleController,
                  decoration: const InputDecoration(
                    labelText: "Seminar Schedule *",
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) => value == null || value.isEmpty ? "Required" : null,
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

              // Notes
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

              const SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  onPressed: _submitForm,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 28),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
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