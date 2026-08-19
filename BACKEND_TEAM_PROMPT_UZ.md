# Backend Team - URGENT FIX

## Muammo
History page'da yangi saqlangan fayllar ko'rinmayapti. Frontend to'g'ri ishlayapti, lekin backend API'da xatolik bor.

## Hozirgi Holat
- ✅ Frontend event sync amalga oshildi
- ✅ API chaqiruvi xatosiz ishlayapti
- ❌ **Database'ga ma'lumot saqlanshmayapti**

## Frontend Nima Qilmoqda

### 1. Fayl Saqlash Jarayoni
```
Information Allocation Page
    ↓
    uploadHistoryFile() → POST /api/history
    ↓
    Backend database'ga saqlashi kerak
    ↓
    Frontend 'history-updated' event yuboradi
    ↓
History Page
    ↓
    getHistory() → GET /api/history
    ↓
    Yangi fayl ko'rinishi kerak
```

### 2. Frontend Console Logs Ko'rsataypti
```
[API] POST /history status: 200
[API] POST /history response: { ... }  // Biror ma'lumot qaytaradi

[History] Raw API response: {
  data: [],                             // ← BO'SH!
  meta: {current_page: 1, last_page: 1, per_page: 20, total: 0}
}
```

## Asosiy Muammo
- POST /api/history → 200 qaytaradi (muvaffaq)
- **LEKIN** GET /api/history → `data: []` qaytaradi (bo'sh)
- **Fayllar database'ga saqlanshmayapti**

## Backend'dan Nima Talab Qilinmoqda

### POST /api/history Endpoint
Qabul qilishi kerak:
```
Form Data:
- file (binary fayl)
- file_name (string: "document_malumotlari.docx")
- type (string: "extraction")
- format (string: "docx", "txt", "csv", "json", "pdf")
- blocks_count (integer: 2)
- result (string: "Ma'lumot muvaffaqiyatli saqlandi")
- status (string: "success")
```

Bajarishi kerak:
1. ✅ Fayl storage'ga saqlash
2. ✅ Record'ni `history` table'ga saqlash
3. ✅ 200 status bilan response qaytarish
4. ✅ Response format:
```json
{
  "id": 123,
  "file_name": "document_malumotlari.docx",
  "type": "extraction",
  "format": "docx",
  "status": "success",
  "result": "Ma'lumot muvaffaqiyatli saqlandi",
  "blocks_count": 2,
  "created_at": "2026-08-19T08:16:35Z",
  "date": "2026-08-19T08:16:35Z"
}
```

### GET /api/history Endpoint
Bajarishi kerak:
1. ✅ `history` table'dan ma'lumot olish
2. ✅ Pagination bilan qaytarish
3. ✅ Response format:
```json
{
  "data": [
    {
      "id": 123,
      "file_name": "document_malumotlari.docx",
      "type": "extraction",
      "format": "docx",
      "status": "success",
      "result": "...",
      "blocks_count": 2,
      "created_at": "2026-08-19T08:16:35Z",
      "date": "2026-08-19T08:16:35Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

## Tekshirish Ro'yxati

- [ ] Database connection ishlayaptimi?
- [ ] `history` table mavjudmi va to'g'ri schemami?
- [ ] POST /api/history haqiqatdan database'ga insert qilyaptimi?
- [ ] `SELECT COUNT(*) FROM history;` natijasi check qilindi?
- [ ] Laravel logs tekshirildi (`storage/logs/laravel.log`)?
- [ ] Authorization token valid?
- [ ] Qo'lda curl test qilindi:

```bash
# Token olish
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# History saqlash
curl -X POST http://127.0.0.1:8000/api/history \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.docx" \
  -F "file_name=test.docx" \
  -F "type=extraction" \
  -F "format=docx" \
  -F "blocks_count=2" \
  -F "result=Test" \
  -F "status=success"

# History olish - yangi fayl ko'rinishi kerak
curl -X GET http://127.0.0.1:8000/api/history \
  -H "Authorization: Bearer $TOKEN"
```

## Nima Qilish Kerak

1. POST endpoint database'ga haqiqatdan saqlayaptimi?
2. GET endpoint saqlangan ma'lumotni qaytarayaptimi?
3. Response format to'g'rimi?
4. Ikkala endpoint birga ishlayaptimi?

## Natija

Frontend **TAYYOQ** va **HOZIR ISHLAYDI**. Shunchaki backend data persist qilishi kerak!

**Xulosa:** Backend POST va GET endpoint'larini tekshiring va fix qiling. Shundan keyin hamma to'g'ri ishlaydi! ✅
