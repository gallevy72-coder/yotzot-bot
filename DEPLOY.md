# 🚀 מדריך פריסה — בוט יוצאות מהכלל

## סקירה
האפליקציה מורכבת משני חלקים:
1. **Backend** — שרת Node.js שרץ על Render.com (חינמי)
2. **Frontend** — קובץ HTML שרץ על GitHub Pages (חינמי)

---

## שלב 1: הגדרת Supabase (מסד נתונים)

1. היכנס ל-[supabase.com](https://supabase.com) → Create new project
2. בחר שם לפרויקט (למשל: `yotzot-bot`)
3. לאחר יצירה, עבור ל-**SQL Editor** והרץ את הקובץ `supabase-setup.sql`
4. שמור את הנתונים הבאים:
   - **Project URL**: מופיע ב-Settings → API → Project URL
   - **Service Role Key**: מופיע ב-Settings → API → service_role key

---

## שלב 2: פריסת Backend על Render.com

1. היכנס ל-[render.com](https://render.com) → New → Web Service
2. חבר את ה-GitHub repository שלך
3. הגדרות:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
4. הוסף **Environment Variables**:
   ```
   ANTHROPIC_API_KEY = sk-ant-...
   SUPABASE_URL = https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY = eyJ...
   PORT = 3001
   ```
5. לאחר ה-deploy, שמור את ה-URL של השרת (למשל: `https://yotzot-bot.onrender.com`)

---

## שלב 3: עדכון ה-Frontend

פתח את `frontend/index.html` ועדכן את שורה 340:
```javascript
const BACKEND_URL = 'https://yotzot-bot.onrender.com'; // ← URL של השרת שלך
```

---

## שלב 4: פריסת Frontend על GitHub Pages

1. צור repository חדש ב-GitHub (למשל: `yotzot-bot`)
2. העלה את תיקיית `frontend` לתוכו
3. עבור ל-Settings → Pages → Source: `main branch / root`
4. הכתובת תהיה: `https://[username].github.io/yotzot-bot`

---

## שלב 5: מפתח API למורים

**אפשרות א׳ — מפתח אחד משותף (מומלץ):**
הטמע את המפתח ישירות בשרת ואל תבקש מהמורים להכניס מפתח.
בקובץ `server.js`, שנה את שורת יצירת ה-Anthropic client:
```javascript
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```
(זה כבר קיים — רק ודא שה-ENV variable מוגדר ב-Render)

**אפשרות ב׳ — כל מורה מכניס מפתח משלו:**
השאר כמו שהוא — המורים מכניסים מפתח בפעם הראשונה ונשמר בדפדפן.

---

## שלב 6: שיתוף עם המורים

שלח לכל צוות:
- קישור לאפליקציה
- (אם אפשרות א׳) — אין צורך במפתח
- (אם אפשרות ב׳) — מפתח Anthropic שהנפקת

---

## עלויות

| שירות | עלות |
|--------|------|
| Supabase | חינמי עד 500MB |
| Render.com | חינמי (נרדם אחרי 15 דק׳ חוסר שימוש) |
| GitHub Pages | חינמי |
| Anthropic API | ~$0.003 לכל הודעה (Sonnet) |

לפרויקט עם 30 מורים × 20 שיחות × 10 הודעות = ~6,000 הודעות ≈ **$18 סה"כ**

---

## פתרון תקלות

**הבוט לא מגיב:**
- בדוק שה-backend רץ ב-Render
- ודא שה-BACKEND_URL בקוד ה-HTML נכון

**שגיאת CORS:**
- ודא שחבילת `cors` מותקנת וקוראים לה לפני כל route

**שגיאת Supabase:**
- ודא שהרצת את `supabase-setup.sql`
- ודא שה-Service Role Key (לא ה-anon key)
