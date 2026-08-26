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
  image:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1546964053-d93311cf64a5?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?auto=format&fit=crop&w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    category: "Clássicos",
    time: "1h",
    servings: "8 fatias",
    difficulty: "Médio",
    author: { name: "Comunidade", avatar: "QP" },
    classic: true,
  },
];
