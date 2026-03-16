import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import '../config/api_config.dart';
import '../models/api_response.dart';

class FileService {
  static final FileService _instance = FileService._internal();
  factory FileService() => _instance;
  FileService._internal();

  // Pick an image from gallery or camera
  Future<XFile?> pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      return await picker.pickImage(source: source);
    } catch (e) {
      print('Error picking image: $e');
      return null;
    }
  }

  // Upload a file to the server
  Future<ApiResponse<Map<String, dynamic>>> uploadFile({
    required String filePath,
    required String token,
    String? category,
    Map<String, String>? additionalFields,
  }) async {
    try {
      final uri = Uri.parse('${ApiConfig.filesEndpoint}/upload');
      final request = http.MultipartRequest('POST', uri);

      // Attach the file
      request.files.add(await http.MultipartFile.fromPath('file', filePath));

      // Add additional fields
      request.fields.addAll({
        'category': category ?? 'general',
        ...?additionalFields,
      });

      // Add authorization header
      request.headers['Authorization'] = 'Bearer $token';

      // Send request
      final streamedResponse = await request.send();

      // Convert to Response so we can read the body easily
      final response = await http.Response.fromStream(streamedResponse);

      final Map<String, dynamic> data =
      response.body.isNotEmpty ? json.decode(response.body) : {};

      if (response.statusCode == 201) {
        return ApiResponse<Map<String, dynamic>>(
          success: true,
          data: data,
          message: data['message'],
        );
      } else {
        return ApiResponse<Map<String, dynamic>>(
          success: false,
          message: data['message'] ?? 'Upload failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Network error during upload',
        errors: [e.toString()],
      );
    }
  }

  // Get user's uploaded files
  Future<ApiResponse<List<dynamic>>> getUserFiles({
    required String token,
    String category = 'general',
  }) async {
    try {
      final uri = Uri.parse('${ApiConfig.filesEndpoint}?category=$category');
      final response = await http.get(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );

      final Map<String, dynamic> data =
      response.body.isNotEmpty ? json.decode(response.body) : {};

      if (response.statusCode == 200) {
        return ApiResponse<List<dynamic>>(
          success: true,
          data: data['files'] ?? [],
          message: data['message'],
        );
      } else {
        return ApiResponse<List<dynamic>>(
          success: false,
          message: data['message'] ?? 'Failed to fetch files',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse<List<dynamic>>(
        success: false,
        message: 'Network error fetching files',
        errors: [e.toString()],
      );
    }
  }

  // Delete a file
  Future<ApiResponse<void>> deleteFile({
    required String filename,
    required String token,
    String category = 'general',
  }) async {
    try {
      final uri = Uri.parse(
          '${ApiConfig.filesEndpoint}/$filename?category=$category');
      final response = await http.delete(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );

      final Map<String, dynamic> data =
      response.body.isNotEmpty ? json.decode(response.body) : {};

      if (response.statusCode == 200) {
        return ApiResponse<void>(
          success: true,
          message: data['message'],
        );
      } else {
        return ApiResponse<void>(
          success: false,
          message: data['message'] ?? 'Failed to delete file',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse<void>(
        success: false,
        message: 'Network error deleting file',
        errors: [e.toString()],
      );
    }
  }
}