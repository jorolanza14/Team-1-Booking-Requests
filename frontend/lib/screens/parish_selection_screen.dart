import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/parish_provider.dart';
import '../widgets/custom_button.dart';

class ParishSelectionScreen extends StatefulWidget {
  static const routeName = '/parish-selection';

  @override
  _ParishSelectionScreenState createState() => _ParishSelectionScreenState();
}

class _ParishSelectionScreenState extends State<ParishSelectionScreen> {
  @override
  void initState() {
    super.initState();
    // Load all parishes when the screen is opened
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ParishProvider>(context, listen: false).loadAllParishes();
    });
  }

  @override
  Widget build(BuildContext context) {
    final parishProvider = context.watch<ParishProvider>();
    final parishes = parishProvider.parishes;

    return Scaffold(
      appBar: AppBar(
        title: Text('Select Parish'),
        centerTitle: true,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Choose a parish for your sacramental service:',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            
            if (parishProvider.isLoading)
              Expanded(
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              )
            else if (parishProvider.errorMessage != null)
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Colors.red,
                      ),
                      SizedBox(height: 16),
                      Text(
                        parishProvider.errorMessage!,
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.red),
                      ),
                      SizedBox(height: 16),
                      CustomButton(
                        text: 'Retry',
                        onPressed: () {
                          parishProvider.loadAllParishes();
                        },
                      ),
                    ],
                  ),
                ),
              )
            else if (parishes.isEmpty)
              Expanded(
                child: Center(
                  child: Text('No parishes available'),
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: parishes.length,
                  itemBuilder: (context, index) {
                    final parish = parishes[index];
                    return Card(
                      margin: EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: Icon(
                          Icons.church,
                          color: Theme.of(context).primaryColor,
                        ),
                        title: Text(parish.name),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(parish.address),
                            if (parish.contactPhone != null)
                              Text('Phone: ${parish.contactPhone}'),
                            if (parish.contactEmail != null)
                              Text('Email: ${parish.contactEmail}'),
                            if (parish.servicesOffered != null && parish.servicesOffered!.isNotEmpty)
                              Wrap(
                                spacing: 4,
                                children: parish.servicesOffered!
                                    .map((service) => Chip(
                                          label: Text(
                                            service,
                                            style: TextStyle(fontSize: 10),
                                          ),
                                          backgroundColor: Colors.grey[200],
                                        ))
                                    .toList(),
                              ),
                          ],
                        ),
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          parishProvider.selectParish(parish);
                          // Navigate back or to next screen
                          Navigator.pop(context, parish);
                        },
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}