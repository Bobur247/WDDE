# History Refresh Testing Guide

## Problem
When saving a file from InformationAllocation page, the History page doesn't show the newly saved file.

## Solution Implemented
1. Event-based synchronization between pages using `window.dispatchEvent`
2. Field name normalization (camelCase/snake_case)
3. Debug logging for troubleshooting

## Testing Steps

### 1. Open Browser Console (F12)
- Filter by: `[History]` or `[InformationAllocation]` tags

### 2. Go to Information Allocation Page
- Open DevTools Console
- You should see: `[History] Event listener attached`

### 3. Upload and Save a File
1. Upload a document
2. Extract some data (using any method)
3. Click "Save" button
4. In console, you should see:
   ```
   [InformationAllocation] Uploading file: document_malumotlari.docx
   [InformationAllocation] File uploaded successfully
   [InformationAllocation] Dispatching history-updated event
   ```

### 4. Go to History Page
- In console, you should see:
   ```
   [History] history-updated event received, refreshing...
   [History] Raw API response: [...]
   [History] Processed items: [...]
   [History] Normalized records: [...]
   ```

### 5. Check Network Tab
- Go to Network tab (F12)
- Look for `/api/history` requests
- Check the response format:
  - Should be an array or `{ data: [...] }`
  - Each item should have: `id`, `file_name` (or `fileName`), `date` (or `created_at`), `type`, `status`

## Common Issues

### Issue 1: Event not dispatched
- Check console for upload error: `[InformationAllocation] Upload error: ...`
- Backend API might be returning error

### Issue 2: Event received but history not updating
- Check console logs for normalization issues
- Verify API response format matches expectations

### Issue 3: API returns 500 error
- Backend might have database issues
- Check backend logs

## Debug Output Examples

### Success Flow:
```
[History] Event listener attached
[InformationAllocation] Uploading file: test_malumotlari.docx
[InformationAllocation] File uploaded successfully
[InformationAllocation] Dispatching history-updated event
[History] history-updated event received, refreshing...
[History] Raw API response: [{id: 1, file_name: "test_malumotlari.docx", ...}]
[History] Processed items: [{id: 1, file_name: "test_malumotlari.docx", ...}]
[History] Normalized records: [{id: 1, fileName: "test_malumotlari.docx", date: Date, ...}]
```

### Error Flow:
```
[InformationAllocation] Uploading file: test_malumotlari.docx
[InformationAllocation] Upload error: 401 Unauthorized
```
