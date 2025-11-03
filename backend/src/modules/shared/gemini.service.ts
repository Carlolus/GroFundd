import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService implements OnModuleInit {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está definida en .env');
    }

    this.client = new GoogleGenerativeAI(apiKey);

    this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash'});
  }

  async parseTransactionsFromText(text: string, user:string, categories: string[]) {

    const today = new Date();
    const onlyDate = today.toISOString().split('T')[0]; // "2025-10-28"


const prompt = `
Current date: "${onlyDate}"
You are a financial assistant specialized in analyzing natural language text.

The user with UUID "${user}" describes their day, mentioning possible incomes and expenses.  
Your task is to:
1. Identify all necessary **categories** (use existing ones when possible, or create new ones if they don’t match).
2. Identify all **transactions** (income or expense) mentioned in the text.
3. Respond **only** with valid JSON — no explanations, no comments, no text outside the JSON object.

---

### CATEGORY INSTRUCTIONS

- Use this list of existing categories: [${categories.join(', ')}].
- If a category mentioned in the text matches an existing one, use its UUID (**IF THE CATEGORY EXIST DO NOT INCLUDE IT IN THE JSON**).
- If it doesn’t exist, create it with the following structure:

\`\`\`json
{
  "id": "generated-uuid",
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
  "categoryId": "uuid-of-existing-or-new-category",
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
      "id": "uuid",
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
      "categoryId": "uuid",
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

    // --- 🛠️ CORRECCIÓN CLAVE: Limpiar la respuesta ---
    let jsonString = responseText.trim();
    
    // 1. Quitar '```json' al inicio
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    // 2. Quitar '```' al final
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    // 3. Limpiar cualquier espacio o salto de línea extra
    jsonString = jsonString.trim(); 

    // Intentar parsear JSON seguro con la cadena LIMPIA
    try {
      const parsed = JSON.parse(jsonString);
      
      // Retornar el objeto completo (no un arreglo), que es la estructura de tu prompt
      return parsed; 
      
    } catch(e) {
      // Si falla, es porque el JSON limpio sigue siendo inválido.
      console.error("🚫 ERROR: Fallo al parsear el JSON de Gemini. Cadena:", jsonString, "Error:", e);
      
      // Retornar la estructura de objeto vacía que el controlador espera.
      // (Si no se ha implementado AiParseResponseDto, usar un objeto vacío que coincida con la estructura)
      return { categories: [], transactions: [] }; 
    }
  }
}
