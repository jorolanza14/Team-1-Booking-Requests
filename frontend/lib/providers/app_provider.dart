import 'package:flutter/material.dart';

class AppProvider extends ChangeNotifier {
  // Example variable
  String _username = '';

  String get username => _username;

  void setUsername(String name) {
    _username = name;
    notifyListeners();
  }
}
