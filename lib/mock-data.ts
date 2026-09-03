export type RecipeMock = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  servings: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  author: { name: string; avatar: string };
  featured?: boolean;
  classic?: boolean;
  aiNutrition?: { kcal: number; proteina: string; carbo: string; gordura: string };
};

export const featuredRecipe: RecipeMock = {
  slug: "moqueca-baiana-de-tilapia",
  title: "Moqueca Baiana de Tilápia com Leite de Coco Fresco",
  description:
    "Uma moqueca cremosa, perfumada no dendê e no coentro, que fica pronta em 35 minutos. A IA corrigiu o ponto do leite de coco e sugeriu uma farofinha de castanha-de-caju para arrematar.",
  image: "/images/mock-destaque.jpg",
  category: "Brasileira",
  time: "35 min",
  servings: "4 porções",
  difficulty: "Médio",
  author: { name: "Marina Queiroz", avatar: "MQ" },
  featured: true,
  aiNutrition: { kcal: 238, proteina: "18g", carbo: "7g", gordura: "14g" },
};

export const latestRecipes: RecipeMock[] = [
  {
    slug: "pao-de-queijo-recheado",
    title: "Pão de Queijo Recheado com Catupiry e Calabresa",
    description:
      "Casquinha crocante, miolo elástico e recheio que escorre. Perfeito pro café da tarde.",
    image: "/images/mock-receita-1.jpg",
    category: "Lanche",
    time: "40 min",
    servings: "12 unidades",
    difficulty: "Fácil",
    author: { name: "Rafael L.", avatar: "RL" },
  },
  {
    slug: "risoto-de-limao-siciliano",
    title: "Risoto de Limão Siciliano com Aspargos",
    description: "Cremoso sem exagero, acidez na medida e um toque de parmesão curado 24 meses.",
    image: "/images/mock-receita-2.jpg",
    category: "Italiana",
    time: "30 min",
    servings: "2 porções",
    difficulty: "Médio",
    author: { name: "Camila N.", avatar: "CN" },
  },
  {
    slug: "coxinha-de-jaca",
    title: "Coxinha de Jaca Desfiada Vegana",
    description: "Massa de mandioca macia e recheio suculento que até carnívoro repete.",
    image: "/images/mock-receita-3.jpg",
    category: "Vegana",
    time: "1h 10",
    servings: "10 unidades",
    difficulty: "Médio",
    author: { name: "Tiago O.", avatar: "TO" },
  },
  {
    slug: "bolo-de-fuba-cremoso",
    title: "Bolo de Fubá Cremoso da Vó Cida",
    description: "Três camadas em uma só forma: creme, pudim e bolo fofinho. Herança de família.",
    image: "/images/mock-receita-4.jpg",
    category: "Doces",
    time: "55 min",
    servings: "8 fatias",
    difficulty: "Fácil",
    author: { name: "Vó Cida", avatar: "VC" },
  },
  {
    slug: "yakisoba-caseiro",
    title: "Yakisoba Caseiro com Legumes Crocantes",
    description: "Molho brilhante, macarrão soltinho e o truque da frigideira bem quente.",
    image: "/images/mock-receita-5.jpg",
    category: "Asiática",
    time: "25 min",
    servings: "3 porções",
    difficulty: "Fácil",
    author: { name: "Kenji H.", avatar: "KH" },
  },
  {
    slug: "feijoada-leve",
    title: "Feijoada Leve de Domingo",
    description: "Versão menos pesada, com costelinha defumada e couve fininha no alho.",
    image: "/images/mock-receita-6.jpg",
    category: "Brasileira",
    time: "2h 30",
    servings: "6 porções",
    difficulty: "Difícil",
    author: { name: "Dona Sônia", avatar: "DS" },
  },
];

export const classicRecipes: RecipeMock[] = [
  {
    slug: "brigadeiro-raiz",
    title: "Brigadeiro Raiz — Ponto de Colher",
    description: "Leite condensado, manteiga e cacau 50%. O clássico que nunca falha.",
    image: "/images/mock-receita-7.jpg",
    category: "Clássicos",
    time: "20 min",
    servings: "20 unidades",
    difficulty: "Fácil",
    author: { name: "Comunidade", avatar: "QP" },
    classic: true,
  },
  {
    slug: "picanha-na-frigideira",
    title: "Picanha na Frigideira com Manteiga de Ervas",
    description: "Selada por fora, rosada por dentro. Sem churrasqueira, sem drama.",
    image: "/images/mock-receita-7.jpg",
    category: "Clássicos",
    time: "18 min",
    servings: "2 porções",
    difficulty: "Médio",
    author: { name: "Comunidade", avatar: "QP" },
    classic: true,
  },
  {
    slug: "arroz-de-coco",
    title: "Arroz de Coco da Baía",
    description: "Soltinho, perfumado e levemente adocicado. Acompanha qualquer moqueca.",
    image: "/images/mock-receita-9.jpg",
    category: "Clássicos",
    time: "22 min",
    servings: "4 porções",
    difficulty: "Fácil",
    author: { name: "Comunidade", avatar: "QP" },
    classic: true,
  },
  {
    slug: "torta-de-frango-cremosa",
    title: "Torta de Frango Cremosa",
    description: "Massa que desmancha e recheio bem temperado. A da lancheira da escola.",
    image: "/images/mock-receita-10.jpg",
    category: "Clássicos",
    time: "1h",
    servings: "8 fatias",
    difficulty: "Médio",
    author: { name: "Comunidade", avatar: "QP" },
    classic: true,
  },
];
