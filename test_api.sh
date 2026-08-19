#!/bin/bash

# Backend'dan history data'ni olish uchun test
echo "Backend API'ni tekshiryapti..."

# Agar backend running bo'lsa, test qilamiz
if curl -s http://127.0.0.1:8000/api/history 2>/dev/null | head -1; then
  echo "Backend javob bermoqda"
  curl -s http://127.0.0.1:8000/api/history 2>&1 | python -m json.tool 2>/dev/null | head -50
else
  echo "Backend javob bermayapti yoki JSON emas"
fi
