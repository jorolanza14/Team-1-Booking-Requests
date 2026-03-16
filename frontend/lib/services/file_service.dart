import 'dart:io';
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
      final XFile? image = await picker.pickImage(source: source);
      return image;
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
      File file = File(filePath);
      
      var response = await ApiConfig.uploadFile(
        ApiConfig.filesEndpoint + '/upload',
        token,
        file,
        'file',
        additionalFields: {
          'category': category ?? 'general',
          ...?additionalFields,
        },
      );

      if (response.statusCode == 201) {
        final responseBody = await response.stream.bytesToString();
        final data = Map<String, dynamic>.from(
          await response.stream.bytesToString().then((value) => value.isNotEmpty ? value : '{}').then((value) => value != '{}' ? value : '{}')
        );
        
        // Parse JSON safely
        Map<String, dynamic> jsonData;
        try {
          jsonData = data.isNotEmpty ? data : {};
        } catch (e) {
          jsonData = {};
        }

        return ApiResponse<Map<String, dynamic>>(
          success: true,
          data: jsonData,
          message: jsonData['message'],
        );
      } else {
        final errorBody = await response.stream.bytesToString();
        Map<String, dynamic> errorData = {};
        try {
          errorData = errorBody.isNotEmpty ? Map<String, dynamic>.from(errorBody) : {};
        } catch (e) {
          errorData = {'error': 'Upload failed'};
        }

        return ApiResponse<Map<String, dynamic>>(
          success: false,
          message: errorData['message'] ?? 'Upload failed',
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
      final response = await ApiConfig.getWithAuth(
        '${ApiConfig.filesEndpoint}?category=$category',
        token,
      );

      if (response.statusCode == 200) {
        final jsonData = await response.stream.bytesToString();
        final Map<String, dynamic> data = 
          jsonData.isNotEmpty ? Map<String, dynamic>.from(jsonData) : {};

        return ApiResponse<List<dynamic>>(
          success: true,
          data: data['files'] ?? [],
          message: data['message'],
        );
      } else {
        return ApiResponse<List<dynamic>>(
          success: false,
          message: 'Failed to fetch files',
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
      final response = await ApiConfig.deleteWithAuth(
        '${ApiConfig.filesEndpoint}/$filename?category=$category',
        token,
      );

      if (response.statusCode == 200) {
        final jsonData = await response.stream.bytesToString();
        final Map<String, dynamic> data = 
          jsonData.isNotEmpty ? Map<String, dynamic>.from(jsonData) : {};

        return ApiResponse<void>(
          success: true,
          message: data['message'],
        );
      } else {
        return ApiResponse<void>(
          success: false,
          message: 'Failed to delete file',
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