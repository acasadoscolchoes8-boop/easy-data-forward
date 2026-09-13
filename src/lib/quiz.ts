import type { Product } from "@/data/site";

export type QuizOption = { value: string; label: string; hint?: string };
export type QuizQuestion = {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "peso",
    title: "Qual o peso de quem vai dormir?",
    subtitle: "Se for casal, considere a pessoa mais pesada.",
    options: [
      { value: "ate80", label: "Até 80 kg" },
      { value: "80a110", label: "Entre 80 e 110 kg" },
      { value: "110a150", label: "Entre 110 e 150 kg" },
      { value: "acima150", label: "Acima de 150 kg" },
    ],
  },
  {
    id: "firmeza",
    title: "Como você gosta da sensação do colchão?",
    options: [
      { value: "macio", label: "Macio", hint: "Sensação de abraço, afunda um pouco" },
      { value: "equilibrado", label: "Equilibrado", hint: "Nem muito macio, nem muito duro" },
      { value: "firme", label: "Firme", hint: "Superfície mais rígida e estável" },
    ],
  },
  {
    id: "uso",
    title: "Quem vai dormir no colchão?",
    subtitle: "Isso ajuda a definir o isolamento de movimentos ideal.",
    options: [
      { value: "solteiro", label: "Uma pessoa" },
      { value: "casal", label: "Casal" },
      { value: "casal-criancas", label: "Casal com crianças ou pets na cama" },
    ],
  },
  {
    id: "coluna",
    title: "Você sente dores nas costas ou na coluna ao acordar?",
    options: [
      { value: "sim", label: "Sim, com frequência" },
      { value: "asvezes", label: "De vez em quando" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    id: "calor",
    title: "Você sente calor durante a noite?",
    options: [
      { value: "muito", label: "Sim, bastante" },
      { value: "pouco", label: "Um pouco" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    id: "movimento",
    title: "Você acorda quando a outra pessoa se mexe na cama?",
    options: [
      { value: "sim", label: "Sim, me incomoda" },
      { value: "nao", label: "Não / durmo sozinho" },
    ],
  },
  {
    id: "altura",
    title: "Que altura de colchão você prefere?",
    options: [
      { value: "alto", label: "Mais alto", hint: "A partir de 30 cm, visual imponente" },
      { value: "medio", label: "Altura média", hint: "Entre 25 e 30 cm" },
      { value: "baixo", label: "Mais baixo", hint: "Até 24 cm, facilita subir e descer" },
    ],
  },
];

export type QuizAnswers = Record<string, string>;

export type Recommendation = {
  product: Product;
  score: number;
  reasons: string[];
};

function heightCm(p: Product) {
  return Number.parseInt(p.altura.replace(/\D/g, ""), 10) || 0;
}

function supportKg(p: Product) {
  return Number.parseInt((p.suporte ?? "").replace(/\D/g, ""), 10) || 0;
}

const NEEDED_SUPPORT: Record<string, number> = {
  ate80: 100,
  "80a110": 140,
  "110a150": 180,
  acima150: 200,
};

export function recommendProducts(catalog: Product[], answers: QuizAnswers): Recommendation[] {
  const needed = NEEDED_SUPPORT[answers["peso"] ?? ""] ?? 0;

  const scored = catalog.map((product) => {
    const reasons: string[] = [];
    let score = 0;

    // Suporte / peso
    const support = supportKg(product);
    if (support >= needed) {
      score += 30;
      if (support > 0) reasons.push(`Suporta até ${support} kg, adequado para o seu peso`);
    } else if (support > 0) {
      score -= 35;
    }

    // Firmeza
    const conforto = (product.conforto ?? "").toLowerCase();
    const firmeza = answers["firmeza"];
    const isMacio = conforto.includes("macio");
    const isExtraFirme = conforto.includes("extra");
    const isFirme = conforto.includes("firme") && !isExtraFirme;
    if (firmeza === "macio") {
      if (isMacio) {
        score += 25;
        reasons.push("Conforto macio, como você prefere");
      } else if (isExtraFirme) score -= 20;
    } else if (firmeza === "equilibrado") {
      if (isFirme) {
        score += 25;
        reasons.push("Firmeza equilibrada, nem dura nem macia demais");
      } else if (isMacio || isExtraFirme) score += 5;
    } else if (firmeza === "firme") {
      if (isExtraFirme) {
        score += 25;
        reasons.push("Superfície extra firme e estável");
      } else if (isFirme) {
        score += 18;
        reasons.push("Conforto firme, com boa sustentação");
      } else if (isMacio) score -= 20;
    }

    // Coluna
    const destaque = (product.destaque ?? "").toLowerCase();
    const mola = (product.mola ?? "").toLowerCase();
    if (answers["coluna"] === "sim" || answers["coluna"] === "asvezes") {
      if (destaque.includes("core lift")) {
        score += 20;
        reasons.push("Tecnologia Core Lift que sustenta a coluna");
      }
      if (mola.includes("ensacada")) {
        score += 12;
        reasons.push("Molas ensacadas que acompanham o corpo ponto a ponto");
      }
    }

    // Calor
    if (answers["calor"] === "muito" || answers["calor"] === "pouco") {
      if (destaque.includes("gel")) {
        score += answers["calor"] === "muito" ? 20 : 10;
        reasons.push("Espuma Gel Sense, que ajuda a dissipar o calor");
      }
    }

    // Movimento do parceiro
    if (answers["movimento"] === "sim" || answers["uso"] !== "solteiro") {
      if (mola.includes("ensacada")) {
        score += 15;
        if (!reasons.some((r) => r.includes("Molas ensacadas"))) {
          reasons.push("Molas ensacadas independentes, que isolam os movimentos");
        }
      }
    }

    // Altura
    const h = heightCm(product);
    const alturaPref = answers["altura"];
    if (alturaPref === "alto" && h >= 30) {
      score += 15;
      reasons.push(`Perfil alto de ${product.altura}`);
    } else if (alturaPref === "medio" && h >= 25 && h < 30) {
      score += 15;
      reasons.push(`Altura média de ${product.altura}`);
    } else if (alturaPref === "baixo" && h <= 24) {
      score += 15;
      reasons.push(`Perfil mais baixo, de ${product.altura}`);
    } else {
      score -= 5;
    }

    return { product, score, reasons: reasons.slice(0, 4) };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function answersSummary(answers: QuizAnswers): string[] {
  return QUIZ_QUESTIONS.map((q) => {
    const option = q.options.find((o) => o.value === answers[q.id]);
    return `${q.title} ${option?.label ?? "-"}`;
  });
}

export function buildWhatsappMessage(
  name: string,
  phone: string,
  answers: QuizAnswers,
  recommendations: Recommendation[],
) {
  const lines = [
    "Olá! Fiz o teste *Escolha o colchão ideal* no site da Mannes.",
    "",
    `*Nome:* ${name}`,
    `*WhatsApp/Telefone:* ${phone}`,
    "",
    "*Minhas respostas:*",
    ...answersSummary(answers).map((l) => `• ${l}`),
    "",
    "*Colchões indicados:*",
    ...recommendations.map((r, i) => `${i + 1}. ${r.product.name}`),
  ];
  return lines.join("\n");
}
