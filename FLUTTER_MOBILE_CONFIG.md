# 📱 FitLife — Konfigurasi Mobile (Flutter/Dart)

> Catatan konfigurasi lengkap untuk integrasi Flutter dengan FitLife REST API.
> Update terakhir: **19 Maret 2026**

---

## Daftar Isi

1. [Base URL & Environment](#1-base-url--environment)
2. [Autentikasi JWT (Wajib Dibaca!)](#2-autentikasi-jwt-wajib-dibaca)
3. [pubspec.yaml — Dependencies](#3-pubspecyaml--dependencies)
4. [Konfigurasi Dio (HTTP Client)](#4-konfigurasi-dio-http-client)
5. [Storage Token (Secure)](#5-storage-token-secure)
6. [Contoh Penggunaan Setiap Endpoint](#6-contoh-penggunaan-setiap-endpoint)
7. [Upload Gambar (Multipart)](#7-upload-gambar-multipart)
8. [Google Sign In](#8-google-sign-in)
9. [Error Handling Standar](#9-error-handling-standar)
10. [Status Kesiapan Endpoint](#10-status-kesiapan-endpoint)
11. [Catatan Penting & Limitasi](#11-catatan-penting--limitasi)

---

## 1. Base URL & Environment

```dart
// lib/core/constants/api_constants.dart

class ApiConstants {
  // Development (emulator Android → gunakan 10.0.2.2, bukan localhost)
  static const String baseUrlDev = 'http://10.0.2.2:3000';

  // Development (iOS Simulator atau device fisik di WiFi yang sama)
  // static const String baseUrlDev = 'http://192.168.x.x:3000';

  // Production
  static const String baseUrlProd = 'https://your-domain.vercel.app';

  // Aktif
  static const String baseUrl = baseUrlDev; // ganti ke baseUrlProd saat release

  // Endpoints
  static const String login        = '/api/auth/login';
  static const String register     = '/api/auth/register';
  static const String logout       = '/api/auth/logout';
  static const String me           = '/api/auth/me';
  static const String google       = '/api/auth/google';
  static const String profile      = '/api/profile';
  static const String profileUpload= '/api/profile/upload';
  static const String password     = '/api/profile/password';
  static const String menus        = '/api/menus';
  static const String artikels     = '/api/artikels';
  static const String perhitungan  = '/api/perhitungan';
  static const String accounts     = '/api/accounts';
  static const String dashboard    = '/api/admin/dashboard';
  static const String uploadMenu   = '/api/upload/menu';
}
```

> **Catatan Android Emulator:** `localhost` di dalam emulator merujuk ke emulator itu sendiri,
> bukan ke mesin host. Gunakan `10.0.2.2` untuk mengakses server di komputer kamu.

---

## 2. Autentikasi JWT (Wajib Dibaca!)

### Bagaimana cara kerjanya?

Setelah login/register, server mengembalikan **JWT Bearer Token** di response body:

```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "name": "...", "email": "...", "role": "user" }
}
```

Flutter harus:
1. **Simpan** token ini ke `FlutterSecureStorage`
2. **Kirim** token di setiap request yang butuh auth via header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Token berlaku selama **7 hari** dan payload berisi: `userId`, `role`, `email`.

### Endpoint yang butuh Auth

| Endpoint | Method | Auth Required |
|---|---|---|
| `/api/auth/me` | GET | ✅ Bearer Token |
| `/api/profile` | GET, PATCH | ✅ Bearer Token |
| `/api/profile/upload` | POST | ✅ Bearer Token |
| `/api/profile/password` | PATCH | ✅ Bearer Token |
| `/api/upload/menu` | POST | ✅ Bearer Token |
| `/api/perhitungan` | GET | ✅ Bearer Token |
| `/api/perhitungan` | POST | ⚡ Opsional (jika login, riwayat tersimpan) |
| `/api/menus` | GET, POST | ❌ Tidak perlu |
| `/api/artikels` | GET, POST | ❌ Tidak perlu |
| `/api/accounts` | GET | ⚠️ Belum dilindungi |
| `/api/admin/dashboard` | GET | ⚠️ Belum dilindungi |

---

## 3. pubspec.yaml — Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter

  # HTTP Client
  dio: ^5.7.0

  # Secure Token Storage
  flutter_secure_storage: ^9.2.2

  # Google Sign In
  google_sign_in: ^6.2.1

  # Image Picker (untuk upload foto)
  image_picker: ^1.1.2

  # State Management (pilih salah satu)
  # riverpod: ^2.5.1
  # provider: ^6.1.2
  # bloc: ^8.1.4

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
```

---

## 4. Konfigurasi Dio (HTTP Client)

```dart
// lib/core/network/dio_client.dart

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/api_constants.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();
  factory DioClient() => _instance;

  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  DioClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Interceptor: otomatis inject Authorization header
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'jwt_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          // Token expired → hapus token lokal
          if (e.response?.statusCode == 401) {
            await _storage.delete(key: 'jwt_token');
            // TODO: redirect ke halaman login
          }
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio;
}
```

---

## 5. Storage Token (Secure)

```dart
// lib/core/services/auth_storage.dart

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static const _tokenKey = 'jwt_token';
  static const _roleKey  = 'user_role';
  static const _userIdKey = 'user_id';

  // Simpan token setelah login
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  // Baca token
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // Simpan info user
  static Future<void> saveUserInfo({
    required int userId,
    required String role,
  }) async {
    await _storage.write(key: _userIdKey, value: userId.toString());
    await _storage.write(key: _roleKey, value: role);
  }

  // Cek apakah user sudah login (ada token)
  static Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: _tokenKey);
    return token != null && token.isNotEmpty;
  }

  // Hapus semua data saat logout
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
```

---

## 6. Contoh Penggunaan Setiap Endpoint

### 6.1 Register

```dart
Future<Map<String, dynamic>> register({
  required String name,
  required String email,
  required String password,
}) async {
  final response = await DioClient().dio.post(
    ApiConstants.register,
    data: {'name': name, 'email': email, 'password': password},
  );

  final token = response.data['token'] as String;
  await AuthStorage.saveToken(token);
  await AuthStorage.saveUserInfo(
    userId: response.data['user']['id'],
    role: response.data['user']['role'],
  );

  return response.data;
}
```

### 6.2 Login

```dart
Future<Map<String, dynamic>> login({
  required String email,
  required String password,
}) async {
  final response = await DioClient().dio.post(
    ApiConstants.login,
    data: {'email': email, 'password': password},
  );

  final token = response.data['token'] as String;
  await AuthStorage.saveToken(token);
  await AuthStorage.saveUserInfo(
    userId: response.data['user']['id'],
    role: response.data['user']['role'],
  );

  return response.data;
}
```

### 6.3 Logout

```dart
Future<void> logout() async {
  try {
    // Opsional: beritahu server (untuk clear cookie web)
    await DioClient().dio.post(ApiConstants.logout);
  } catch (_) {
    // Abaikan error
  } finally {
    // Yang penting: hapus token lokal
    await AuthStorage.clearAll();
  }
}
```

### 6.4 Cek User (Me)

```dart
Future<Map<String, dynamic>> getMe() async {
  // Token otomatis di-inject oleh DioClient interceptor
  final response = await DioClient().dio.get(ApiConstants.me);
  return response.data['user'];
}
```

### 6.5 Get Menus (dengan Pagination)

```dart
Future<Map<String, dynamic>> getMenus({
  String? target,       // 'Kurus' | 'Normal' | 'Berlebih' | 'Obesitas'
  int page = 1,
  int limit = 10,
}) async {
  final response = await DioClient().dio.get(
    ApiConstants.menus,
    queryParameters: {
      if (target != null) 'target': target,
      'page': page,
      'limit': limit,
    },
  );

  // Response dengan pagination:
  // { "data": [...], "meta": { "total": 100, "page": 1, "limit": 10, ... } }
  return response.data;
}
```

### 6.6 Get Menu by Slug

```dart
Future<Map<String, dynamic>> getMenuBySlug(String slug) async {
  final response = await DioClient().dio.get('${ApiConstants.menus}/$slug');
  return response.data;
}
```

### 6.7 Get Artikels (dengan Filter & Pagination)

```dart
Future<Map<String, dynamic>> getArtikels({
  String? kategori,
  bool? featured,
  int page = 1,
  int limit = 10,
}) async {
  final response = await DioClient().dio.get(
    ApiConstants.artikels,
    queryParameters: {
      if (kategori != null) 'kategori': kategori,
      if (featured != null) 'featured': featured,
      'page': page,
      'limit': limit,
    },
  );
  return response.data;
}
```

### 6.8 Hitung BMI

```dart
// Tanpa login — hanya dapat hasil, tidak tersimpan
Future<Map<String, dynamic>> hitungBMI({
  required double tinggiBadan,  // cm
  required double beratBadan,   // kg
}) async {
  final response = await DioClient().dio.post(
    ApiConstants.perhitungan,
    data: {
      'tinggi_badan': tinggiBadan,
      'berat_badan': beratBadan,
    },
  );
  // Response: { "bmi": 24.2, "status": "Normal" }
  return response.data;
}

// Riwayat BMI (butuh login)
Future<List<dynamic>> getRiwayatBMI() async {
  final response = await DioClient().dio.get(ApiConstants.perhitungan);
  return response.data as List;
}
```

### 6.9 Update Profil

```dart
Future<Map<String, dynamic>> updateProfile({
  String? name,
  String? username,
  String? phone,
  DateTime? birthdate,
  int? weight,
  int? height,
}) async {
  final response = await DioClient().dio.patch(
    ApiConstants.profile,
    data: {
      if (name != null)      'name': name,
      if (username != null)  'username': username,
      if (phone != null)     'phone': phone,
      if (birthdate != null) 'birthdate': birthdate.toIso8601String(),
      if (weight != null)    'weight': weight,
      if (height != null)    'height': height,
    },
  );
  return response.data;
}
```

### 6.10 Ganti Password

```dart
Future<void> changePassword({
  required String currentPassword,
  required String newPassword,
}) async {
  await DioClient().dio.patch(
    ApiConstants.password,
    data: {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    },
  );
}
```

---

## 7. Upload Gambar (Multipart)

### 7.1 Upload Foto Profil

```dart
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';

Future<Map<String, dynamic>> uploadProfilePhoto() async {
  final picker = ImagePicker();
  final picked = await picker.pickImage(
    source: ImageSource.gallery,
    imageQuality: 80,   // kompres sebelum upload
    maxWidth: 800,
  );

  if (picked == null) return {};

  final formData = FormData.fromMap({
    'photo': await MultipartFile.fromFile(
      picked.path,
      filename: 'profile_photo.jpg',
    ),
  });

  final response = await DioClient().dio.post(
    ApiConstants.profileUpload,
    data: formData,
    options: Options(
      contentType: 'multipart/form-data',
    ),
  );

  // Response: { "message": "Foto berhasil diupload", "user": {...} }
  return response.data;
}
```

### 7.2 Upload Gambar Menu (Admin)

```dart
Future<String> uploadMenuImage(String filePath) async {
  final formData = FormData.fromMap({
    'file': await MultipartFile.fromFile(
      filePath,
      filename: 'menu_image.jpg',
    ),
    'folder': 'fitlife/menus',  // opsional
  });

  final response = await DioClient().dio.post(
    ApiConstants.uploadMenu,
    data: formData,
    options: Options(contentType: 'multipart/form-data'),
  );

  // Response: { "url": "https://res.cloudinary.com/..." }
  return response.data['url'] as String;
}
```

---

## 8. Google Sign In

### Tambahkan di `pubspec.yaml`

```yaml
google_sign_in: ^6.2.1
```

### Konfigurasi Android `android/app/build.gradle`

```groovy
// Tidak ada perubahan khusus, tapi pastikan:
minSdkVersion 21
```

### Tambahkan client ID di `android/app/src/main/res/values/strings.xml`

```xml
<resources>
  <string name="default_web_client_id">YOUR_WEB_CLIENT_ID.apps.googleusercontent.com</string>
</resources>
```

### Kode Flutter

```dart
import 'package:google_sign_in/google_sign_in.dart';

final _googleSignIn = GoogleSignIn(
  scopes: ['email', 'profile'],
);

Future<Map<String, dynamic>> signInWithGoogle() async {
  // 1. Trigger Google Sign In
  final googleUser = await _googleSignIn.signIn();
  if (googleUser == null) throw Exception('Google Sign In dibatalkan');

  // 2. Ambil Auth credentials
  final googleAuth = await googleUser.authentication;

  // 3. Kirim accessToken ke backend FitLife
  //    (Backend akan verifikasi ke Google API)
  final response = await DioClient().dio.post(
    ApiConstants.google,
    data: {'token': googleAuth.accessToken},
  );

  // 4. Simpan JWT token yang dikembalikan server
  final token = response.data['token'] as String;
  await AuthStorage.saveToken(token);
  await AuthStorage.saveUserInfo(
    userId: response.data['user']['id'],
    role: response.data['user']['role'],
  );

  return response.data;
}
```

> **Penting:** Backend menerima **accessToken** dari Google (bukan idToken).
> Token akan diverifikasi ke `https://www.googleapis.com/oauth2/v3/userinfo`.

---

## 9. Error Handling Standar

```dart
// lib/core/network/api_error_handler.dart

import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

ApiException handleDioError(DioException e) {
  final statusCode = e.response?.statusCode;
  final data = e.response?.data;

  // Ekstrak pesan error dari respons server
  String message = 'Terjadi kesalahan';
  if (data is Map) {
    message = data['message'] as String? ?? message;
    // Validasi error (Zod) → format berbeda
    if (data.containsKey('errors')) {
      final errors = data['errors'] as Map;
      final firstField = errors.values.first;
      if (firstField is List && firstField.isNotEmpty) {
        message = firstField.first.toString();
      }
    }
  }

  switch (statusCode) {
    case 400:  return ApiException(message, statusCode: 400);
    case 401:  return ApiException('Sesi berakhir, silakan login ulang', statusCode: 401);
    case 404:  return ApiException(message, statusCode: 404);
    case 409:  return ApiException(message, statusCode: 409);
    case 500:  return ApiException('Server error, coba lagi nanti', statusCode: 500);
    default:
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout) {
        return ApiException('Koneksi timeout, periksa internet kamu');
      }
      if (e.type == DioExceptionType.connectionError) {
        return ApiException('Tidak dapat terhubung ke server');
      }
      return ApiException(message, statusCode: statusCode);
  }
}

// Cara pakai:
// try {
//   final result = await login(email: ..., password: ...);
// } on DioException catch (e) {
//   final error = handleDioError(e);
//   showSnackBar(error.message);
// }
```

---

## 10. Status Kesiapan Endpoint

| Endpoint | Status | Catatan |
|---|---|---|
| `POST /api/auth/register` | ✅ Siap | Langsung return JWT |
| `POST /api/auth/login` | ✅ Siap | Langsung return JWT |
| `POST /api/auth/logout` | ✅ Siap | Hapus token lokal cukup |
| `GET /api/auth/me` | ✅ Siap | Butuh Bearer Token |
| `POST /api/auth/google` | ✅ Siap | Butuh `accessToken` Google |
| `GET /api/profile` | ✅ Siap | Butuh Bearer Token |
| `PATCH /api/profile` | ✅ Siap | Butuh Bearer Token |
| `POST /api/profile/upload` | ✅ Siap | Butuh Bearer Token, max 2MB |
| `PATCH /api/profile/password` | ✅ Siap | Butuh Bearer Token |
| `GET /api/menus` | ✅ Siap | Publik, ada pagination |
| `GET /api/menus/:slug` | ✅ Siap | Publik |
| `POST /api/menus` | ⚠️ Siap (tidak aman) | Belum ada proteksi admin |
| `PUT /api/menus/:slug` | ⚠️ Siap (tidak aman) | Belum ada proteksi admin |
| `DELETE /api/menus/:slug` | ⚠️ Siap (tidak aman) | Belum ada proteksi admin |
| `GET /api/artikels` | ✅ Siap | Publik, ada pagination |
| `POST /api/artikels` | ⚠️ Siap (tidak aman) | Belum ada proteksi admin |
| `POST /api/perhitungan` | ✅ Siap | Auth opsional |
| `GET /api/perhitungan` | ✅ Siap | Butuh Bearer Token |
| `GET /api/accounts` | ⚠️ Siap (tidak aman) | Sebaiknya admin only |
| `GET /api/admin/dashboard` | ⚠️ Siap (tidak aman) | Sebaiknya admin only |
| `POST /api/upload/menu` | ✅ Siap | Butuh Bearer Token, max 3MB |

---

## 11. Catatan Penting & Limitasi

### ✅ Sudah Berfungsi untuk Flutter

- Semua endpoint publik (GET menus, GET artikels) langsung bisa dipakai
- Login/Register sudah mengembalikan JWT Bearer Token — **tidak perlu CookieJar**
- `getAuthUser()` di server sudah mendukung **dua mode**:
  - Cookie httpOnly (untuk web)
  - `Authorization: Bearer <token>` (untuk mobile)

### ⚠️ Perlu Perhatian

1. **`/api/profile/upload` dan `/api/profile/password`** masih menggunakan `cookies()` lama untuk ambil `userId`.
   Jika menggunakan Bearer Token, endpoint ini mungkin mengembalikan 401.
   → **Workaround:** gunakan `/api/profile` (PATCH) untuk update data user biasa.

2. **Rate Limiting belum ada** — endpoint login/register rentan brute force.
   Flutter developer disarankan menambahkan debounce di form login.

3. **Proteksi admin belum ada** — endpoint POST/PUT/DELETE di menu dan artikel,
   serta `/api/accounts` dan `/api/admin/dashboard` bisa diakses siapa saja.
   Jangan expose ke user biasa.

4. **CORS:** Flutter native HTTP client **tidak terblokir CORS** (CORS hanya berlaku di browser/WebView).

### 📋 Referensi

- **OpenAPI Spec lengkap:** [`openapi.yaml`](./openapi.yaml) — bisa dibuka di [Swagger Editor](https://editor.swagger.io/)
- **Audit API:** [`AUDIT_API_FLUTTER.txt`](./AUDIT_API_FLUTTER.txt)
- **Framework:** Next.js 16 App Router
- **Database:** PostgreSQL via Neon.tech + Prisma ORM
- **Auth:** JWT HS256 via `jose` package, expire 7 hari
- **Storage:** Cloudinary (gambar)
- **Deploy:** Vercel
