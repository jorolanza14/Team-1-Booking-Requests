import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/api_response.dart';
import '../config/api_config.dart';
import '../config/app_constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Generic GET request
  Future<ApiResponse<dynamic>> get(String endpoint, {String? token}) async {
    try {
      late http.Response response;
      
      if (token != null) {
        response = await ApiConfig.getWithAuth(endpoint, token);
      } else {
        response = await ApiConfig.get(endpoint);
      }

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return ApiResponse(
          success: true,
          data: data,
        );
      } else if (response.statusCode == 401) {
        return ApiResponse(
          success: false,
          message: AppConstants.unauthorizedErrorMessage,
          statusCode: response.statusCode,
        );
      } else {
        final errorData = json.decode(response.body);
        return ApiResponse(
          success: false,
          message: errorData['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: AppConstants.networkErrorMessage,
        errors: [e.toString()],
      );
    }
  }

  // Generic POST request
  Future<ApiResponse<dynamic>> post(String endpoint, dynamic body, {String? token}) async {
    try {
      late http.Response response;
      
      if (token != null) {
        response = await ApiConfig.postWithAuth(endpoint, token, json.encode(body));
      } else {
        response = await ApiConfig.post(endpoint, json.encode(body));
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = json.decode(response.body);
        return ApiResponse(
          success: true,
          data: data,
          message: data['message'],
        );
      } else if (response.statusCode == 401) {
        return ApiResponse(
          success: false,
          message: AppConstants.unauthorizedErrorMessage,
          statusCode: response.statusCode,
        );
      } else {
        final errorData = json.decode(response.body);
        return ApiResponse(
          success: false,
          message: errorData['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: AppConstants.networkErrorMessage,
        errors: [e.toString()],
      );
    }
  }

  // Generic PUT request
  Future<ApiResponse<dynamic>> put(String endpoint, dynamic body, {String? token}) async {
    try {
      late http.Response response;
      
      if (token != null) {
        response = await ApiConfig.putWithAuth(endpoint, token, json.encode(body));
      } else {
        // For public PUT requests if needed
        response = await http.put(
          Uri.parse('${ApiConfig.baseUrl}$endpoint'),
          headers: ApiConfig.baseHeaders,
          body: json.encode(body),
        ).timeout(AppConstants.apiTimeout);
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = json.decode(response.body);
        return ApiResponse(
          success: true,
          data: data,
          message: data['message'],
        );
      } else if (response.statusCode == 401) {
        return ApiResponse(
          success: false,
          message: AppConstants.unauthorizedErrorMessage,
          statusCode: response.statusCode,
        );
      } else {
        final errorData = json.decode(response.body);
        return ApiResponse(
          success: false,
          message: errorData['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: AppConstants.networkErrorMessage,
        errors: [e.toString()],
      );
    }
  }

  // Generic PATCH request
  Future<ApiResponse<dynamic>> patch(String endpoint, dynamic body, {String? token}) async {
    try {
      late http.Response response;
      
      if (token != null) {
        response = await ApiConfig.patchWithAuth(endpoint, token, json.encode(body));
      } else {
        // For public PATCH requests if needed
        response = await http.patch(
          Uri.parse('${ApiConfig.baseUrl}$endpoint'),
          headers: ApiConfig.baseHeaders,
          body: json.encode(body),
        ).timeout(AppConstants.apiTimeout);
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = json.decode(response.body);
        return ApiResponse(
          success: true,
          data: data,
          message: data['message'],
        );
      } else if (response.statusCode == 401) {
        return ApiResponse(
          success: false,
          message: AppConstants.unauthorizedErrorMessage,
          statusCode: response.statusCode,
        );
      } else {
        final errorData = json.decode(response.body);
        return ApiResponse(
          success: false,
          message: errorData['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: AppConstants.networkErrorMessage,
        errors: [e.toString()],
      );
    }
  }

  // Generic DELETE request
  Future<ApiResponse<dynamic>> delete(String endpoint, {String? token}) async {
    try {
      late http.Response response;
      
      if (token != null) {
        response = await ApiConfig.deleteWithAuth(endpoint, token);
      } else {
        // For public DELETE requests if needed
        response = await http.delete(
          Uri.parse('${ApiConfig.baseUrl}$endpoint'),
          headers: ApiConfig.baseHeaders,
        ).timeout(AppConstants.apiTimeout);
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = json.decode(response.body);
        return ApiResponse(
          success: true,
          data: data,
          message: data['message'],
        );
      } else if (response.statusCode == 401) {
        return ApiResponse(
          success: false,
          message: AppConstants.unauthorizedErrorMessage,
          statusCode: response.statusCode,
        );
      } else {
        final errorData = json.decode(response.body);
        return ApiResponse(
          success: false,
          message: errorData['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: AppConstants.networkErrorMessage,
        errors: [e.toString()],
      );
    }
  }
}