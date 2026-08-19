# Backend API Fix Required

## Problem
History page doesn't show newly saved files from Information Allocation page.

## Frontend Has Fixed
- ✅ Event-based sync implemented
- ✅ Field name normalization (snake_case → camelCase)
- ✅ Error handling and logging

## What Backend Must Return

### GET /api/history Response Format

**Current Issue:** Backend returns HTML error page or incorrect format

**Expected Format:**
```json
[
  {
    "id": 1,
    "file_name": "document_malumotlari.docx",
    "type": "extraction",
    "format": "docx",
    "status": "success",
    "result": "Ma'lumot muvaffaqiyatli saqlandi",
    "date": "2026-08-19T08:00:00Z",
    "blocks_count": 2,
    "created_at": "2026-08-19T08:00:00Z"
  }
]
```

**Or with pagination:**
```json
{
  "data": [
    {
      "id": 1,
      "file_name": "...",
      ...
    }
  ]
}
```

### POST /api/history Response Format

**Should return the created record with same format as GET**

## Checklist for Backend

- [ ] `/api/history` GET endpoint returns JSON array (not HTML)
- [ ] Each item has: `id`, `file_name`, `type`, `format`, `status`, `result`, `date`
- [ ] `date` field is ISO 8601 format (e.g., "2026-08-19T08:00:00Z")
- [ ] `/api/history` POST endpoint returns created record
- [ ] Authentication is working (check token validation)
- [ ] Database connection is working

## Quick Test

```bash
# Get auth token
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token to get history
curl -X GET http://127.0.0.1:8000/api/history \
  -H "Authorization: Bearer TOKEN_HERE"

# Check response is JSON array with proper fields
```

## Frontend Debug Output When Working

```
[History] Raw API response: [{id: 1, file_name: "...", date: "...", ...}]
[History] Processed items: [...]
[History] Normalized records: [{id: 1, fileName: "...", date: Date(...), ...}]
```

## If Backend Returns 500 Error

Check:
1. Database migrations ran successfully
2. HISTORY table exists with correct schema
3. User authentication token is valid
4. Laravel error log at `storage/logs/laravel.log`
