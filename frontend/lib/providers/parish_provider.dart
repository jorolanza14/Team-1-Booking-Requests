import 'package:flutter/foundation.dart';

import '../models/parish.dart';
import '../services/parish_service.dart';

class ParishProvider extends ChangeNotifier {
  final ParishService _parishService = ParishService();
  
  List<Parish> _parishes = [];
  Parish? _selectedParish;
  bool _isLoading = false;
  String? _errorMessage;

  List<Parish> get parishes => _parishes;
  Parish? get selectedParish => _selectedParish;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  ParishProvider() {
    loadAllParishes();
  }

  Future<void> loadAllParishes({String? token}) async {
    _setLoading(true);
    _setErrorMessage(null);

    final result = await _parishService.getAllParishes(token: token);
    
    if (result.success && result.data != null) {
      _parishes = result.data!;
      _setLoading(false);
      notifyListeners();
    } else {
      _setLoading(false);
      _setErrorMessage(result.message ?? 'Failed to load parishes');
      notifyListeners();
    }
  }

  Future<void> loadParishById(int id, {String? token}) async {
    _setLoading(true);
    _setErrorMessage(null);

    final result = await _parishService.getParishById(id, token: token);
    
    if (result.success && result.data != null) {
      _setSelectedParish(result.data!);
      _setLoading(false);
      notifyListeners();
    } else {
      _setLoading(false);
      _setErrorMessage(result.message ?? 'Failed to load parish');
      notifyListeners();
    }
  }

  Future<void> searchParishes({
    String? query,
    List<String>? services,
    String? token,
  }) async {
    _setLoading(true);
    _setErrorMessage(null);

    final result = await _parishService.searchParishes(
      query: query,
      services: services,
      token: token,
    );
    
    if (result.success && result.data != null) {
      _parishes = result.data!;
      _setLoading(false);
      notifyListeners();
    } else {
      _setLoading(false);
      _setErrorMessage(result.message ?? 'Failed to search parishes');
      notifyListeners();
    }
  }

  Future<void> loadParishesByService(String service, {String? token}) async {
    _setLoading(true);
    _setErrorMessage(null);

    final result = await _parishService.getParishesByService(service, token: token);
    
    if (result.success && result.data != null) {
      _parishes = result.data!;
      _setLoading(false);
      notifyListeners();
    } else {
      _setLoading(false);
      _setErrorMessage(result.message ?? 'Failed to load parishes by service');
      notifyListeners();
    }
  }

  void selectParish(Parish parish) {
    _selectedParish = parish;
    notifyListeners();
  }

  void clearSelection() {
    _selectedParish = null;
    notifyListeners();
  }

  void clearError() {
    _setErrorMessage(null);
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setSelectedParish(Parish parish) {
    _selectedParish = parish;
    notifyListeners();
  }

  void _setErrorMessage(String? message) {
    _errorMessage = message;
    notifyListeners();
  }
}