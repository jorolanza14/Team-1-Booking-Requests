import 'dart:io';
import 'package:http/http.dart' as http;

import 'app_constants.dart';

class ApiConfig {
  static final String baseUrl = AppConstants.apiBaseUrl;
  
  // Headers
  static Map<String, String> get baseHeaders {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
  
  static Map<String, String> getAuthHeaders(String token) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
  
  // Endpoints
  static const String authEndpoint = '/api/auth';
  static const String loginEndpoint = '$authEndpoint/login';
  static const String registerEndpoint = '$authEndpoint/register';
  static const String refreshEndpoint = '$authEndpoint/refresh';
  static const String profileEndpoint = '$authEndpoint/me';
  static const String changePasswordEndpoint = '$authEndpoint/change-password';
  
  static const String bookingsEndpoint = '/api/bookings';
  static const String intentionsEndpoint = '/api/intentions';
  static const String usersEndpoint = '/api/users';
  static const String filesEndpoint = '/api/files';
  static const String parishesEndpoint = '/api/parishes';
  
  static const String healthEndpoint = '/health';
  static const String apiInfoEndpoint = '/api';
  
  // HTTP Methods with Authorization
  static Future<http.Response> getWithAuth(String endpoint, String token) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = getAuthHeaders(token);
    
    return http.get(uri, headers: headers).timeout(AppConstants.apiTimeout);
  }
  
  static Future<http.Response> postWithAuth(String endpoint, String token, dynamic body) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = getAuthHeaders(token);
    
    return http.post(uri, headers: headers, body: body).timeout(AppConstants.apiTimeout);
  }
  
  static Future<http.Response> putWithAuth(String endpoint, String token, dynamic body) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = getAuthHeaders(token);
    
    return http.put(uri, headers: headers, body: body).timeout(AppConstants.apiTimeout);
  }
  
  static Future<http.Response> patchWithAuth(String endpoint, String token, dynamic body) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = getAuthHeaders(token);
    
    return http.patch(uri, headers: headers, body: body).timeout(AppConstants.apiTimeout);
  }
  
  static Future<http.Response> deleteWithAuth(String endpoint, String token) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = getAuthHeaders(token);
    
    return http.delete(uri, headers: headers).timeout(AppConstants.apiTimeout);
  }
  
  // Public HTTP Methods
  static Future<http.Response> get(String endpoint) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    
    return http.get(uri, headers: baseHeaders).timeout(AppConstants.apiTimeout);
  }
  
  static Future<http.Response> post(String endpoint, dynamic body) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    
    return http.post(uri, headers: baseHeaders, body: body).timeout(AppConstants.apiTimeout);
  }
  
  // File upload with authorization
  static Future<http.StreamedResponse> uploadFile(
    String endpoint, 
    String token, 
    File file, 
    String fieldName,
    {Map<String, String>? additionalFields}
  ) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final request = http.MultipartRequest('POST', uri);
    
    // Add authorization header
    request.headers.addAll(getAuthHeaders(token));
    
    // Add file
    request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));
    
    // Add additional fields if provided
    if (additionalFields != null) {
      request.fields.addAll(additionalFields);
    }
    
    return request.send().timeout(AppConstants.apiTimeout);
  }
}