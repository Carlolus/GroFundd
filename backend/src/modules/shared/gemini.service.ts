import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { AiLogService } from '../ai_logs/ai_logs.service';

@Injectable()
export class GeminiService implements OnModuleInit {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService, private aiLogService: AiLogService) { }

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está definida en .env');
    }

    this.client = new GoogleGenerativeAI(apiKey);

    this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async parseTransactionsFromText(text: string, user: string, currency: string, categories: string[], categoriesCount: number) {

    const today = new Date();
    const onlyDate = today.toISOString().split('T')[0]; // "2025-10-28"
    console.log("Moneda recibida:", currency)
    console.log("Total categorias: ", categoriesCount)
    const newId = categoriesCount + 2;


    const prompt = `
Current date: "${onlyDate}"
You are a financial assistant specialized in analyzing natural language text.

The user with UUID "${user}" with currency "${currency}" describes their day, mentioning possible incomes and expenses.  
Your task is to:
1. Identify all necessary **categories** (use existing ones when possible, or create new ones if they don’t match).
1.2. Use "${newId}" as the next id, increment by 1 for each category.
2. Identify all **transactions** (income or expense) mentioned in the text.
3. Respond **only** with valid JSON — no explanations, no comments, no text outside the JSON object.

---

### CATEGORY INSTRUCTIONS

- Use this list of existing categories: [${categories.join(', ')}].
- If a category mentioned in the text matches an existing one, use its UUID (**IF THE CATEGORY EXIST DO NOT INCLUDE IT IN THE JSON**).
- If it doesn’t exist, create it with the following structure:

\`\`\`json
{
  "id": "number", (USE THA LAST CATEGORY ID + 1)
  "user": "${user}",
  "name": "category-name",
  "icon": "icon-name-or-null",
  "isAiGenerated": true,
  "createdAt": "YYYY-MM-DD" (current date)
}
\`\`\`

---

### TRANSACTION INSTRUCTIONS

Each transaction must follow this format, you should be aware of the current date, if the user says Yesterday you should put that day in date:

\`\`\`json
{
  "user": "${user}",
  "category": "id-of-existing-or-new-category",
  "type": "income" | "expense",
  "amount": number,
  "description": "short description of the movement",
  "aiCategorySuggestion": "identified-category-name",
  "date": "YYYY-MM-DD" (use current date if not mentioned)
}
\`\`\`

---

### FINAL RESPONSE FORMAT

Your output **must be a single valid JSON** with this structure:

\`\`\`json
{
  "categories": [
    {
      "id": "number",
      "user": "${user}",
      "name": "name",
      "icon": "icon-or-null",
      "isAiGenerated": true,
      "createdAt": "YYYY-MM-DD"
    }
  ],
  "transactions": [
    {
      "user": "${user}",
      "category": "number",
      "type": "income" | "expense",
      "amount": number,
      "description": "text",
      "aiCategorySuggestion": "category-name",
      "date": "YYYY-MM-DD"
    }
  ]
}
\`\`\`

Make sure the JSON is **parsable** and that there is no text before or after the main JSON object.

---

### USER TEXT

"""${text}"""

Respond **only** with the final JSON object.
`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Respuesta RAW de Gemini:", responseText)
    this.aiLogService.create({
      userId: user,
      type: 'Transaction Parse',
      input_text: text,
      output_text: responseText,
      model: 'gemini-2.5-flash',
    });

    let jsonString = responseText.trim();

    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    jsonString = jsonString.trim();
    try {
      const parsed = JSON.parse(jsonString);
      return parsed;

    } catch (e) {
      console.error("🚫 ERROR: Fallo al parsear el JSON de Gemini. Cadena:", jsonString, "Error:", e);
      return { categories: [], transactions: [] };
    }
  }

  async evaluateFinancialMonth(
    budgetSummary: any,
    incomeExpense: any,
    expensesByCategory: any[],
    userId: string,
    currency: string,
    month: number,
    year: number,
  ): Promise<any> {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const prompt = `
Eres un asesor financiero experto y empático. Analiza los datos financieros del mes de ${monthNames[month - 1]} ${year} y proporciona una evaluación personalizada en español.

DATOS FINANCIEROS DEL USUARIO:

PRESUPUESTOS:
- Total presupuestado: ${budgetSummary.totals?.total_budgeted || 0} ${currency}
- Total gastado: ${budgetSummary.totals?.total_spent || 0} ${currency}
- Total restante: ${budgetSummary.totals?.total_remaining || 0} ${currency}
- Porcentaje usado: ${budgetSummary.totals?.overall_percentage || 0}%
- Categorías en control: ${budgetSummary.totals?.categories_on_track || 0}
- Categorías en alerta: ${budgetSummary.totals?.categories_warning || 0}
- Categorías excedidas: ${budgetSummary.totals?.categories_exceeded || 0}
- Categorías sin presupuesto: ${budgetSummary.totals?.categories_without_budget || 0}

INGRESOS VS GASTOS:
- Ingresos del mes: ${incomeExpense.income || 0} ${currency}
- Gastos del mes: ${incomeExpense.expense || 0} ${currency}
- Diferencia (ahorro): ${incomeExpense.difference || 0} ${currency}

GASTOS POR CATEGORÍA:
${expensesByCategory.map(cat => `- ${cat.category_name}: ${cat.total} ${currency} (${cat.percentage.toFixed(1)}%)`).join('\n')}

TIEMPO:
- Días transcurridos: ${budgetSummary.time_info?.days_passed || 0}
- Días en el mes: ${budgetSummary.time_info?.days_in_month || 0}
- Progreso del mes: ${budgetSummary.time_info?.month_progress_percentage || 0}%

INSTRUCCIONES:
1. Analiza el desempeño financiero del usuario de manera constructiva
2. Identifica logros y áreas de mejora
3. Proporciona recomendaciones específicas y accionables
4. Asigna una puntuación del 1 al 10 basada en:
   - Control de presupuesto (40%)
   - Capacidad de ahorro (30%)
   - Distribución de gastos (20%)
   - Tendencias positivas (10%)

Responde SOLO con JSON válido, sin texto adicional antes o después:

{
  "evaluation": "Evaluación general en 2-3 párrafos, tono positivo y motivador",
  "score": número decimal del 1.0 al 10.0,
  "highlights": {
    "positive": ["logro específico 1", "logro específico 2", "logro específico 3"],
    "negative": ["área de mejora 1", "área de mejora 2"]
  },
  "recommendations": [
    "Recomendación específica y accionable 1",
    "Recomendación específica y accionable 2",
    "Recomendación específica y accionable 3"
  ],
  "insights": [
    "Insight sobre patrones de gasto 1",
    "Insight sobre tendencias 2"
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("📊 Respuesta de evaluación de Gemini:", responseText);

      // Log the interaction
      await this.aiLogService.create({
        userId,
        type: 'Monthly Evaluation',
        input_text: prompt,
        output_text: responseText,
        model: 'gemini-2.5-flash',
      });

      // Parse JSON response
      let jsonString = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3);
      }

      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }

      jsonString = jsonString.trim();

      const parsed = JSON.parse(jsonString);
      return parsed;

    } catch (e) {
      console.error("🚫 ERROR: Fallo al evaluar el mes con Gemini:", e);

      // Return a fallback response
      return {
        evaluation: 'No se pudo generar la evaluación automática en este momento.',
        score: 5.0,
        highlights: {
          positive: ['Datos procesados correctamente'],
          negative: ['Error al generar evaluación detallada'],
        },
        recommendations: ['Intenta nuevamente en unos momentos'],
        insights: [],
      };
    }
  }
}

