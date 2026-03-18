import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';

class ConfirmationBookingScreen extends StatefulWidget {
  const ConfirmationBookingScreen({super.key});

  @override
  State<ConfirmationBookingScreen> createState() =>
      _ConfirmationBookingScreenState();
}

class _ConfirmationBookingScreenState
    extends State<ConfirmationBookingScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _confirmandNameController =
      TextEditingController();
  final TextEditingController _fatherNameController =
      TextEditingController();
  final TextEditingController _motherNameController =
      TextEditingController();
  final TextEditingController _sponsorController =
      TextEditingController();
  final TextEditingController _preferredParishController =
      TextEditingController();
  final TextEditingController _preferredDateController =
      TextEditingController();
  final TextEditingController _preferredTimeController =
      TextEditingController();
  final TextEditingController _preferredPriestController =
      TextEditingController();

  // File
  PlatformFile? _baptismalCertificate;

  @override
  void dispose() {
    _confirmandNameController.dispose();
    _fatherNameController.dispose();
    _motherNameController.dispose();
    _sponsorController.dispose();
    _preferredParishController.dispose();
    _preferredDateController.dispose();
    _preferredTimeController.dispose();
    _preferredPriestController.dispose();
    super.dispose();
  }

  // File Picker
  Future<void> _pickBaptismalCertificate() async {
    FilePickerResult? result =
        await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'png'],
    );

    if (result != null) {
      setState(() {
        _baptismalCertificate = result.files.first;
      });
    }
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      if (_baptismalCertificate == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content:
                  Text("Please upload baptismal certificate")),
        );
        return;
      }

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("Booking Submitted"),
          content: const Text(
              "Your confirmation booking request has been submitted. Parish will confirm availability."),
          actions: [
            TextButton(
              onPressed: () =>
                  Navigator.of(context).pop(),
              child: const Text("OK"),
            )
          ],
        ),
      );
    }
  }

  Widget _buildSection(
      {required String title,
      required List<Widget> children}) {
    return Card(
      elevation: 2,
      margin:
          const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(12)),
      child: Padding(
        padding:
            const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
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
        title: const Text("Confirmation Booking"),
        centerTitle: true,
        leading: TextButton.icon(
          onPressed: () {
            Navigator.of(context).pop();
          },
          icon: const Icon(Icons.arrow_back,
              color: Colors.white),
          label: const Text(
            "Home",
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding:
            const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Fill out the form below to submit your booking request. All fields marked with * are required.",
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 5),
              const Text(
                "Subject to availability. Parish will confirm your booking and selected priest.",
                style: TextStyle(
                  fontSize: 14,
                  fontStyle: FontStyle.italic,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 20),

              // Confirmand Info
              _buildSection(
                title: "Confirmand Information",
                children: [
                  TextFormField(
                    controller:
                        _confirmandNameController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Confirmand Name *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller:
                        _fatherNameController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Father's Name *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller:
                        _motherNameController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Mother's Name *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                  ),
                ],
              ),

              // Sponsor
              _buildSection(
                title: "Sponsor / Godparent",
                children: [
                  TextFormField(
                    controller:
                        _sponsorController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Sponsor/Godparent Name *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                  ),
                ],
              ),

              // Document Upload
              _buildSection(
                title: "Required Document",
                children: [
                  ElevatedButton.icon(
                    onPressed:
                        _pickBaptismalCertificate,
                    icon: const Icon(
                        Icons.upload_file),
                    label: const Text(
                        "Upload Baptismal Certificate *"),
                  ),
                  const SizedBox(height: 8),
                  if (_baptismalCertificate != null)
                    Text(
                      "Selected: ${_baptismalCertificate!.name}",
                      style: const TextStyle(
                          color: Colors.green),
                    ),
                ],
              ),

              // Booking Preferences
              _buildSection(
                title: "Booking Preferences",
                children: [
                  TextFormField(
                    controller:
                        _preferredParishController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Preferred Parish *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller:
                        _preferredDateController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Preferred Confirmation Date *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                    onTap: () async {
                      FocusScope.of(context)
                          .requestFocus(
                              FocusNode());
                      DateTime? pickedDate =
                          await showDatePicker(
                        context: context,
                        initialDate:
                            DateTime.now(),
                        firstDate:
                            DateTime.now(),
                        lastDate: DateTime.now()
                            .add(const Duration(
                                days: 365)),
                      );
                      if (pickedDate != null) {
                        _preferredDateController
                            .text =
                            "${pickedDate.year}-${pickedDate.month}-${pickedDate.day}";
                      }
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller:
                        _preferredTimeController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Preferred Time Slot *",
                      border:
                          OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null ||
                                value.isEmpty
                            ? "Required"
                            : null,
                    onTap: () async {
                      FocusScope.of(context)
                          .requestFocus(
                              FocusNode());
                      TimeOfDay? pickedTime =
                          await showTimePicker(
                        context: context,
                        initialTime:
                            TimeOfDay.now(),
                      );
                      if (pickedTime != null) {
                        _preferredTimeController
                            .text =
                            "${pickedTime.hour}:${pickedTime.minute}";
                      }
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller:
                        _preferredPriestController,
                    decoration:
                        const InputDecoration(
                      labelText:
                          "Preferred Priest (Optional) - Subject to availability",
                      border:
                          OutlineInputBorder(),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              ElevatedButton(
                onPressed: _submitForm,
                child:
                    const Text("Submit Booking"),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}