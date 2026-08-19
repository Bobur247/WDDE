# Backend API Response Debug Prompt

Backend'da `/api/history` POST endpoint'ni tekshirish uchun quyidagini bajarish kerak:

## 1. API Response Formatini Tekshiring

`POST /api/history` request'ga response qayida bo'lishida, quyidagi ma'lumotlarni qaytarishi kerak:

```json
{
  "id": 123,
  "file_name": "document_malumotlari.docx",
  "type": "extraction",
  "format": "docx",
  "status": "success",
  "result": "Ma'lumot muvaffaqiyatli saqlandi",
  "date": "2026-08-19T08:06:24Z",
  "blocks_count": 2
}
```

**Frontend kutgan format** (`History.js` 97-100 qatorlar):
- Hamma fields array ichida bo'lishi kerak yoki `data` property ichida
- `date` field ISO format'da bo'lishi kerak (frontend `new Date(item.date)` qiladi)
- `fileName`, `type`, `status`, `result` fields mavjud bo'lishi kerak

## 2. Muammoning Sabablari:

### A. Response massiv bo'lmasligi (array qaytarmayapti)
**Xatolik belgilari:**
- Frontend `Array.isArray(data)` check qiladi (History.js 97 qator)
- Agar response massiv bo'lmasa, `data?.data || []` bo'ladi
- Agar backend faqat `{ id: ..., file_name: ... }` qaytarsa (single object), bu `[]` ga aylanadi

**Yechim:**
- Backend `/api/history` GET endpoint'i massiv qaytarishi kerak:
```json
[
  { "id": 1, "file_name": "...", "date": "...", ... },
  { "id": 2, "file_name": "...", "date": "...", ... }
]
```

### B. Field nomları noto'g'ri bo'lishi
- Frontend `item.fileName` kutadi (camelCase)
- Backend `file_name` qaytarsa (snake_case), bu `undefined` bo'ladi
- Jadval bo'sh bo'ladi, lekin xatolik ko'rinmaydi

**Yechim:**
- Backend API response'ini camelCase'ga o'girish yoki
- Frontend'da snake_case'dan camelCase'ga konversiya qilish

### C. `date` field ISO format'da bo'lmasligi
- Frontend `new Date(item.date)` qiladi
- Agar format noto'g'ri bo'lsa, `Invalid Date` bo'ladi

## 3. Frontend'da logging qo'shish

`History.js` 94-100 qatorlarga debug log qo'shing:

```javascript
getHistory()
  .then((data) => {
    console.log('Raw API response:', data);
    if (cancelled) return
    const items = Array.isArray(data) ? data : data?.data || []
    console.log('Processed items:', items);
    setRecords(
      items.map((item) => {
        console.log('Processing item:', item);
        return { ...item, date: new Date(item.date) };
      }),
    )
  })
```

## 4. Network Tab'da Tekshiring

Chrome DevTools → Network tab → `/api/history` request → Response tab
- Response massiv bo'lishini tekshiring
- Field nomlarini tekshiring
- `date` formatini tekshiring

## 5. Tezkor Yechim

Agar backend response format'i aniq bo'lmasa, frontend'da konversiya qilish:

```javascript
const items = Array.isArray(data) ? data : data?.data || []
const normalized = items.map(item => ({
  ...item,
  fileName: item.fileName || item.file_name,
  blocksCount: item.blocksCount || item.blocks_count,
  date: new Date(item.date || item.created_at)
}))
```
