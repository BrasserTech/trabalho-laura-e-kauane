export const categories = ['Tecnologia', 'Negócios', 'Saúde', 'Educação', 'Cultura'] as const

export type Course = {
  id: string
  title: string
  provider: string
  category: string
  topic: string
  hours: number
  rating: string
  reviews: number
  price: number
  type: 'Cursos' | 'Eventos' | 'Atividades'
  description: string
  institutions: string[]
}

export const institutions = ['Unoesc', 'Outras instituições']

export const courses: Course[] = [
  { id: 'ia', title: 'Introdução à Inteligência Artificial', provider: 'Google', category: 'Tecnologia', topic: 'Inteligência Artificial', hours: 20, rating: '4,8', reviews: 312, price: 0, type: 'Cursos', description: 'Aprenda os principais conceitos de Inteligência Artificial, suas aplicações no dia a dia e como ela está transformando o mercado de trabalho.', institutions },
  { id: 'projetos', title: 'Gestão de Projetos', provider: 'SEBRAE', category: 'Negócios', topic: 'Planejamento', hours: 40, rating: '4,7', reviews: 210, price: 0, type: 'Cursos', description: 'Aprenda a planejar projetos, organizar prazos e acompanhar as entregas da sua equipe.', institutions },
  { id: 'excel', title: 'Excel do Básico ao Avançado', provider: 'Udemy', category: 'Educação', topic: 'Produtividade', hours: 30, rating: '4,8', reviews: 180, price: 39.9, type: 'Cursos', description: 'Pratique fórmulas, tabelas e gráficos para organizar e interpretar dados.', institutions },
  { id: 'marketing', title: 'Marketing Digital Completo', provider: 'SEBRAE', category: 'Negócios', topic: 'Marketing', hours: 40, rating: '4,7', reviews: 128, price: 0, type: 'Cursos', description: 'Conheça os fundamentos de marketing digital, redes sociais e campanhas.', institutions },
  { id: 'oratoria', title: 'Comunicação e Oratória', provider: 'SENAI', category: 'Educação', topic: 'Desenvolvimento Pessoal', hours: 30, rating: '4,8', reviews: 90, price: 49.9, type: 'Cursos', description: 'Exercite sua comunicação e organize apresentações com clareza.', institutions },
  { id: 'foto', title: 'Fotografia para Iniciantes', provider: 'SEBRAE', category: 'Cultura', topic: 'Arte', hours: 20, rating: '4,9', reviews: 120, price: 0, type: 'Atividades', description: 'Explore luz, enquadramento e composição com a câmera que você já tem.', institutions: ['Outras instituições'] },
  { id: 'saude', title: 'Saúde Mental na Universidade', provider: 'Campus Virtual Fiocruz', category: 'Saúde', topic: 'Bem-estar', hours: 15, rating: '4,8', reviews: 85, price: 0, type: 'Eventos', description: 'Conheça práticas de cuidado com a saúde mental no cotidiano universitário.', institutions },
]
