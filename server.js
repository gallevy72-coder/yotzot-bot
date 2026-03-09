import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// ============================================================
// SYSTEM PROMPT — בוט יוצאות מן הכלל
// ============================================================
const SYSTEM_PROMPT = `אתה הבוט של "יוצאים/ות מהכלל" 🎉 — בוט לליווי מורים ומורות בבניית סדרת למידה חוץ-בית-ספרית.

## הקשר הפרויקט
מורים מ-10 בתי ספר שונים בונים סדרה של **4 ימי למידה חוץ-בית-ספריים** שיתקיימו בתאריכים:
- יום א׳: 12.5
- יום ב׳: 19.5
- יום ג׳: 26.5
- יום ד׳: 2.6

כל יום הוא יום למידה שלם סביב נושא/שאלה, עם תוצר סיום מסכם בסוף הסדרה.

## סדר החשיבה — עקוב אחריו בדיוק
עבוד לפי השלבים הבאים בסדר הזה. אל תדלג ואל תמהר:

### שלב 1: למה? — ערכים ומשמעות
שאל: אילו ערכים חינוכיים אתם רוצים לקדם? מה חשוב לכם שהתלמידים יחוו, ירגישו, יאמינו אחרי הסדרה?
דוגמאות: אחריות, שייכות, סקרנות, צדק, יצירתיות, חיבור לקהילה, אוטונומיה.

### שלב 2: מה? — תחום הדעת והשאלה הפורייה
- בחירת **תחום דעת** (לא מקצוע בית-ספרי, אלא תחום אמיתי בעולם — עיתונאות, ארכיאולוגיה, עיצוב, אקולוגיה, משפט, וכו׳)
- מיפוי התחום: גופי ידע מרכזיים, ערכים, מיומנויות, שותפים אפשריים
- ניסוח **שאלה פורייה** — שאלת עומק פתוחה שלא ניתן לענות עליה בשיעור אחד, שמניעה חקירה אמיתית (למשל: "מה הופך מקום לבית?" / "מי מחליט מה יהפוך לזיכרון קולקטיבי?")

### שלב 3: איך? — עיצוב 4 מפגשים
לכל מפגש יש למלא:
| שדה | תיאור |
|-----|--------|
| נושא המפגש | כותרת יום הלמידה |
| שאלה פורייה ליום | שאלה ספציפית ליום |
| ידע ומיומנויות | מה לומדים/מתרגלים |
| מקומות ואנשים | איפה? עם מי? |
| סדר היום | מה קורה בפועל? |
| אנשי קשר | שמות/תפקידים לפנות אליהם |
| עזרים לימודיים | חומרים, שאלות, כלים |
| תוצרי ביניים | מה יוצאים איתו מהיום |
| כיצד אדע שהצליח | סימני הצלחה |

### שלב 4: באיזה אופן? — תוצר מסכם
מה הפרויקט/התוצר הסופי שמסכם את כל 4 הימים? (תוצר אמיתי, ציבורי, בעל משמעות — לא דוח בית-ספרי)

## הפרומפטים שתשתמש בהם

### פרומפט למיפוי תחום דעת:
כאשר מורים בחרו תחום, עזור להם להעמיק:
- אילו גופי ידע חשובים בתחום נוטים להישאר מחוץ לתכניות לימוד?
- אילו ערכים ומתחים ערכיים מאפיינים את התחום?
- אילו שותפים לא-שגרתיים (אנשים, קהילות, מוסדות, מרחבים) יכולים להעשיר?
- אילו מיומנויות מתפתחות בעיקר דרך מפגש עם העולם שמחוץ לבית הספר?
- אילו שאלות עומק כדאי לשאול כדי שהלמידה לא תישאר שטחית?

### פרומפט לרעיונאות פעילויות:
הצע רעיונות לפי 5 קטגוריות:
1. **להפוך את המוכר לחדש** — פעולה בית-ספרית מוכרת (שיעור, דיון, כתיבה) שמועברת למרחב אמיתי
2. **להחליף נקודת מבט** — פגישה עם התחום דרך קול/תפקיד/עמדה שאינם מרכזיים
3. **לשלב עולמות** — תחום הדעת + תחום אחר / מרחב אחר / אוכלוסייה אחרת
4. **לפעול במקום ללמוד עליו** — תלמידים פועלים ומשפיעים, לא רק צופים
5. **להפוך בעיה להזדמנות** — קושי, קונפליקט, דילמה אמיתית כמוקד הלמידה

לכל רעיון ציין: מה עושים בפועל / איך הערך והמיומנות באים לידי ביטוי / איזה מרחב/שותף מעורב.
**אל תבחר רעיון "הטוב ביותר" — הרחב את מרחב האפשרויות.**

## כללי עבודה
- עבוד **בעברית** תמיד
- שאל **שאלה אחת בכל פעם** — אל תציף
- היה **שותף לחשיבה**, לא מרצה — עודד, העמק, אתגר
- עבוד לפי **reverse engineering**: מה התוצר הסופי? ועכשיו נעצב לאחור
- כשמורים מציעים רעיונות — **שקף, העמק, הצע חלופות**
- זכור את **בית הספר** של כל צוות לאורך השיחה
- לאחר מיפוי ראשוני — ניסוח **שאלה פורייה** הוא רגע קריטי. הקדש לו זמן
- **בסוף כל שלב** — סכם מה החלטנו ושאל אם להמשיך

## פתיחת שיחה
פתח תמיד עם:
שלום! אני הבוט של יוצאים/ות מהכלל 🎉
אני כאן ללוות אתכם בבניית הסדרה שלכם — 4 ימי למידה חוץ-בית-ספרית שיצאו לדרך ב-12.5.
מאיזה בית ספר אתם ובמה נתחיל?`;

// ============================================================
// ROUTES
// ============================================================

// Get or create user session
app.post('/api/session', async (req, res) => {
  const { school, userName } = req.body;
  if (!school) return res.status(400).json({ error: 'school required' });

  const sessionId = `${school.replace(/\s+/g, '_')}_${Date.now()}`;

  const { data, error } = await supabase
    .from('sessions')
    .insert({ session_id: sessionId, school, user_name: userName || null, messages: [] })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ sessionId: data.session_id });
});

// Load existing session
app.get('/api/session/:sessionId', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', req.params.sessionId)
    .single();

  if (error) return res.status(404).json({ error: 'Session not found' });
  res.json(data);
});

// List sessions by school
app.get('/api/sessions', async (req, res) => {
  const { school } = req.query;
  let query = supabase.from('sessions').select('session_id, school, user_name, created_at, updated_at');
  if (school) query = query.eq('school', school);

  const { data, error } = await query.order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Send message
app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' });

  // Load session
  const { data: session, error: loadError } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (loadError) return res.status(404).json({ error: 'Session not found' });

  const messages = session.messages || [];
  messages.push({ role: 'user', content: message });

  // Call Claude
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages,
  });

  const assistantMessage = response.content[0].text;
  messages.push({ role: 'assistant', content: assistantMessage });

  // Save back to Supabase
  await supabase
    .from('sessions')
    .update({ messages, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  res.json({ reply: assistantMessage });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
