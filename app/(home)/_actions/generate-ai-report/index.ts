"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";

const DUMMY_REPORT = `
### Relatório de Finanças Pessoais

#### Resumo Geral das Finanças
...

#### Conclusão
Melhorar sua vida financeira é um processo contínuo que envolve planejamento, monitoramento e ajustes regulares.
`;

// Configuração do Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Modelo utilizado
});

// Configuração para geração de texto
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Função para gerar relatório AI
export const generateAiReport = async ({
  month,
}: GenerateAiReportSchema): Promise<string> => {
  generateAiReportSchema.parse({ month });

  const { userId } = await auth();

  if (!userId) {
    throw new Error(
      "Não autorizado. Faça login para acessar esta funcionalidade.",
    );
  }

  const user = await clerkClient.users.getUser(userId);
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  if (!hasPremiumPlan) {
    throw new Error(
      "É necessário um plano premium para gerar relatórios com IA.",
    );
  }

  if (!GEMINI_API_KEY) {
    console.warn(
      "A chave GEMINI_API_KEY não está configurada. Retornando relatório padrão.",
    );
    return DUMMY_REPORT;
  }

  const startDate = new Date(`2024-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  if (!transactions.length) {
    return "Nenhuma transação encontrada para o período especificado.";
  }

  const content = `
  Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira.
  As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. São elas:
  ${transactions
    .map(
      (transaction) =>
        `${transaction.date.toISOString().split("T")[0]}-R$${transaction.amount.toFixed(2)}-${transaction.type}-${transaction.category}`,
    )
    .join(";")}
  `;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [], // Histórico do chat (se necessário)
    });

    const result = await chatSession.sendMessage(content);
    return result.response.text() || "Erro ao gerar relatório.";
  } catch (error) {
    console.error("Erro ao gerar relatório com Gemini:", error);
    return "Ocorreu um problema ao processar o relatório de IA. Tente novamente mais tarde.";
  }
};
