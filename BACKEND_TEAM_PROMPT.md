# Backend Team - Urgent Fix Needed

## Problem
History page doesn't show newly saved files. Frontend is working correctly, but backend API has issues.

## Current Status
- ✅ Frontend event sync implemented
- ✅ API calls working without errors
- ❌ **Data not persisting in database**

## What Frontend is Doing

### 1. File Upload Flow
```
Information Allocation Page
    ↓
    uploadHistoryFile() → POST /api/history
    ↓
    Backend saves to database
    ↓
    Frontend emits 'history-updated' event
    ↓
History Page
    ↓
    getHistory() → GET /api/history
    ↓
    Should show newly saved file
```

### 2. Frontend Logs Show
```
[API] POST /history status: 200
[API] POST /history response: { ... }  // Returns something

[History] Raw API response: {
  data: [],                             // ← EMPTY!
  meta: {current_page: 1, last_page: 1, per_page: 20, total: 0}
}
```

## The Issue
- POST /api/history returns 200 (success)
- But GET /api/history returns `data: []` (empty)
- **Files are not being saved to database**

## What Backend Must Do

### POST /api/history Endpoint
Should accept:
```
Form Data:
- file (binary)
- file_name (string)
- type (string: "extraction")
- format (string: "docx", "txt", "csv", "json", "pdf")
- blocks_count (integer)
- result (string)
- status (string: "success")
```

Must:
1. ✅ Save file to storage
2. ✅ Save record to `history` table
3. ✅ Return 200 status with created record
4. ✅ Return response format:
```json
{
  "id": 123,
  "file_name": "document_malumotlari.docx",
  "type": "extraction",
  "format": "docx",
  "status": "success",
  "result": "Ma'lumot muvaffaqiyatli saqlandi",
  "blocks_count": 2,
  "created_at": "2026-08-19T08:00:00Z",
  "date": "2026-08-19T08:00:00Z"
}
```

### GET /api/history Endpoint
Should:
1. ✅ Query `history` table
2. ✅ Return all records with pagination
3. ✅ Return response format:
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
      "created_at": "2026-08-19T08:00:00Z",
      "date": "2026-08-19T08:00:00Z"
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

## Debugging Checklist

- [ ] Check database connection is working
- [ ] Check `history` table exists and has correct schema
- [ ] Check POST /api/history actually inserts into database
- [ ] Run: `SELECT COUNT(*) FROM history;` after saving
- [ ] Check Laravel error logs in `storage/logs/laravel.log`
- [ ] Verify authentication token is valid
- [ ] Test with raw curl:

```bash
# Get token
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.token')

# Post history
curl -X POST http://127.0.0.1:8000/api/history \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.docx" \
  -F "file_name=test.docx" \
  -F "type=extraction" \
  -F "format=docx" \
  -F "blocks_count=2" \
  -F "result=Test" \
  -F "status=success"

# Get history - should show the saved file
curl -X GET http://127.0.0.1:8000/api/history \
  -H "Authorization: Bearer $TOKEN"
```

## Why This Matters

Frontend is **fully functional** and **ready**. This is purely a backend data persistence issue.

**Action Required:**
1. Verify POST endpoint saves to database
2. Verify GET endpoint returns saved data
3. Return response in correct JSON format
4. Test both endpoints work together

Once backend is fixed, everything will work automatically!
