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

    // Especifica el modelo que deseas usar
    // Ej: 'gemini-1.5-flash', 'gemini-pro'
    this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash'});
  }

  async parseTransactionsFromText(text: string, user:string, categories: string[]) {

const prompt = `
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

Each transaction must follow this format:

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
    console.log(responseText)

    // Intentar parsear JSON seguro
    try {
      const parsed = JSON.parse(responseText);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
