class Booking {
  final int? id;
  final int? userId;
  final int? parishId;
  final String? parishName;
  final String bookingType;
  final DateTime requestedDate;
  final String status;
  final String? notes;
  final List<String>? documents;
  final Map<String, dynamic>? additionalInfo;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Booking({
    this.id,
    this.userId,
    this.parishId,
    this.parishName,
    required this.bookingType,
    required this.requestedDate,
    required this.status,
    this.notes,
    this.documents,
    this.additionalInfo,
    this.createdAt,
    this.updatedAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      userId: json['userId'],
      parishId: json['parishId'],
      parishName: json['parishName'] ?? json['parish']?['name'], // Include parish data if available
      bookingType: json['bookingType'],
      requestedDate: DateTime.parse(json['requestedDate']),
      status: json['status'],
      notes: json['notes'],
      documents: json['documents'] != null 
          ? List<String>.from(json['documents']) 
          : null,
      additionalInfo: json['additionalInfo'],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'parishId': parishId,
      'parishName': parishName,
      'bookingType': bookingType,
      'requestedDate': requestedDate.toIso8601String(),
      'status': status,
      'notes': notes,
      'documents': documents,
      'additionalInfo': additionalInfo,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  Booking copyWith({
    int? id,
    int? userId,
    int? parishId,
    String? parishName,
    String? bookingType,
    DateTime? requestedDate,
    String? status,
    String? notes,
    List<String>? documents,
    Map<String, dynamic>? additionalInfo,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Booking(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      parishId: parishId ?? this.parishId,
      parishName: parishName ?? this.parishName,
      bookingType: bookingType ?? this.bookingType,
      requestedDate: requestedDate ?? this.requestedDate,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      documents: documents ?? this.documents,
      additionalInfo: additionalInfo ?? this.additionalInfo,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}