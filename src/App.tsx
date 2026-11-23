import { useState, type FormEvent } from 'react'
import { Apple, ArrowLeft, ArrowRight, Bell, Bookmark, ChartNoAxesColumnIncreasing, Check, ChevronRight, Clock3, Eye, EyeOff, FileText, GraduationCap, Heart, HeartPulse, House, Landmark, Leaf, LockKeyhole, Mail, Monitor, Palette, Search, Share, SlidersHorizontal, Star, Target, UserRound } from 'lucide-react'
import { categories, courses, institutions, type Course } from './data/courses'
import { useSession } from './session'

type Page = 'home' | 'explore' | 'hours' | 'favorites' | 'profile'
type Auth = 'welcome' | 'login' | 'register' | 'recover'
const demoEmail = import.meta.env.DEV ? 'aluno@acadup.test' : ''
const demoPassword = import.meta.env.DEV ? 'acadup123' : ''
const navigation = [
  { id: 'home', label: 'Início', icon: House },
  { id: 'explore', label: 'Explorar', icon: Search },
  { id: 'hours', label: 'Minhas Horas', icon: Clock3 },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'profile', label: 'Perfil', icon: UserRound },
] as const
const categoryIcons = [Monitor, ChartNoAxesColumnIncreasing, HeartPulse, Leaf, Palette]
const image = (id: string) => '/images/' + id + '.webp'
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const brand = <span className="brand"><img src={image('cap')} alt="" /><span>Acad<b>Up</b></span></span>
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function App() {
  const { session, save, clear } = useSession()
  const [auth, setAuth] = useState<Auth | null>(() => session.profile || session.guest ? null : 'welcome')
  const [page, setPage] = useState<Page>('home')
  const [selected, setSelected] = useState<Course>()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [institution, setInstitution] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [favoritesTab, setFavoritesTab] = useState('Todos')
  const [hoursTab, setHoursTab] = useState('Meus cursos')
  const [detailTab, setDetailTab] = useState('Sobre')
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [notifications, setNotifications] = useState(false)

  function navigate(next: Page) {
    setPage(next)
    setSelected(undefined)
    setNotifications(false)
    setNotice('')
    window.scrollTo(0, 0)
  }

  function showAuth(next: Auth) {
    setNotice('')
    setVisiblePassword(false)
    setAuth(next)
  }

  function enter(name: string, email: string) {
    save({ ...session, guest: false, profile: { name, email } })
    setAuth(null)
    navigate('home')
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim()
    if (auth === 'recover') {
      setNotice('Recuperação demonstrativa. Você pode entrar com uma senha de teste.')
      return
    }
    enter(String(form.get('name') ?? '').trim() || email.split('@')[0], email)
  }

  function favorite(id: string) {
    const favorites = session.favorites.includes(id) ? session.favorites.filter(item => item !== id) : [...session.favorites, id]
    save({ ...session, favorites })
  }

  function open(course: Course) {
    setSelected(course)
    setDetailTab('Sobre')
    setNotice('')
    window.scrollTo(0, 0)
  }

  function explore(nextCategory = 'Todas', nextQuery = '', filters = false) {
    setCategory(nextCategory)
    setQuery(nextQuery)
    setInstitution('')
    setDuration('')
    setPrice('')
    setShowFilters(filters)
    navigate('explore')
  }

  function courseCard(course: Course, layout: 'feature' | 'popular' | 'list') {
    const saved = session.favorites.includes(course.id)
    const status = session.enrollments[course.id]
    return <article className={'course ' + layout} key={course.id}>
      <button className="course-link" onClick={() => open(course)}>
        <span className="thumb"><img src={image(course.id === 'ia' ? 'ia-card' : course.id)} alt="" />
          {layout === 'feature' && <span className={'badge ' + (course.id === 'ia' ? 'free' : '')}>{course.id === 'ia' ? 'Gratuito' : 'Certificado'}</span>}
        </span>
        <span className="course-copy">
          <strong>{course.title}</strong>
          {layout === 'list' && <><span className="provider">{course.provider}</span><span className="tags"><span>{course.category}</span><span>{course.topic}</span></span></>}
          <span className="meta"><span><Clock3 />{course.hours} horas</span>{layout !== 'popular' && <span><Monitor /> Online</span>}
            {layout === 'list' && <span className={'badge ' + (status === 'active' ? 'pending' : status || !course.price ? 'free' : 'paid')}>{status === 'complete' ? 'Concluído' : status === 'active' ? 'Em andamento' : course.price ? money.format(course.price) : 'Gratuito'}</span>}
          </span>
          {layout !== 'list' && <span className="meta">{layout === 'feature' && <span className="provider">{course.provider}</span>}<span><Star className="star" />{course.rating}{layout === 'feature' && ' (' + course.reviews + ')'}</span></span>}
        </span>
        {layout === 'list' && <ChevronRight className="chevron" size={16} />}
      </button>
      {layout !== 'popular' && <button className="heart" aria-label={saved ? 'Remover dos favoritos' : 'Favoritar ' + course.title} aria-pressed={saved} onClick={() => favorite(course.id)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>}
    </article>
  }

  if (auth === 'welcome') return <main className="shell welcome">
    <img className="welcome-art" src={image('welcome')} alt="AcadUp. Explore, conheça, pontue, evolua." />
    <div className="welcome-actions">
      <button className="primary with-arrow" onClick={() => showAuth('login')}>Entrar <ArrowRight size={18} /></button>
      <button className="outline" onClick={() => showAuth('register')}>Criar conta</button>
      <button className="text-button" onClick={() => { save({ ...session, guest: true }); setAuth(null); navigate('home') }}>Continuar como visitante</button>
    </div>
  </main>

  if (auth) return <main className="shell login">
    <button className="icon-button back-auth" aria-label="Voltar" onClick={() => showAuth(auth === 'recover' ? 'login' : 'welcome')}><ArrowLeft size={18} /></button>
    <div className="login-body">
      {brand}
      <p className="motto">Explore • Conheça • Pontue • Evolua</p>
      <h1>{auth === 'login' ? <>Sua jornada<br />além da sala de aula</> : auth === 'register' ? 'Criar conta' : 'Recuperar senha'}</h1>
      <p className="intro">{auth === 'login' ? 'Encontre cursos, participe de atividades complementares e acompanhe suas horas em um só lugar.' : auth === 'register' ? 'Crie seu perfil de estudante.' : 'Informe o e-mail do seu perfil.'}</p>
      <form key={auth} onSubmit={signIn}>
        {auth === 'register' && <label className="field"><UserRound /><input aria-label="Nome" name="name" placeholder="Nome" autoComplete="name" required /></label>}
        <label className="field"><Mail /><input aria-label="E-mail" name="email" type="email" autoComplete="email" defaultValue={demoEmail} placeholder="E-mail" required /></label>
        {auth !== 'recover' && <div className="field"><LockKeyhole /><input aria-label="Senha" name="password" type={visiblePassword ? 'text' : 'password'} defaultValue={demoPassword} autoComplete={auth === 'login' ? 'current-password' : 'new-password'} placeholder="Senha" minLength={4} required /><button type="button" className="icon-button" aria-label={visiblePassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisiblePassword(!visiblePassword)}>{visiblePassword ? <EyeOff /> : <Eye />}</button></div>}
        {auth === 'login' && <button type="button" className="text-button forgot" onClick={() => showAuth('recover')}>Esqueceu a senha?</button>}
        <button className="primary">{auth === 'login' ? 'Entrar' : auth === 'register' ? 'Criar conta' : 'Recuperar senha'}</button>
      </form>
      {notice && <p role="status">{notice}</p>}
      {auth === 'login' && <>
        <p className="separator">ou continue com</p>
        <div className="social">
          <button onClick={() => enter('Estudante', 'google@acadup.test')}><b className="google">G</b>Google</button>
          <button onClick={() => enter('Estudante', 'apple@acadup.test')}><Apple size={18} fill="currentColor" />Apple</button>
        </div>
        <p className="register">Ainda não tem uma conta? <button className="text-button" onClick={() => showAuth('register')}>Criar conta</button></p>
      </>}
    </div>
    <img className="campus" src={image('campus')} alt="" />
  </main>

  if (selected) {
    const course = selected
    const saved = session.favorites.includes(course.id)
    const status = session.enrollments[course.id]
    return <main className="shell detail">
      <div className="detail-hero" style={{ backgroundImage: 'url(' + image(course.id) + ')' }}>
        <div className="detail-tools">
          <button className="icon-button" aria-label="Voltar" onClick={() => navigate(page)}><ArrowLeft /></button>
          <button className="icon-button" aria-label="Favoritar" aria-pressed={saved} onClick={() => favorite(course.id)}><Heart fill={saved ? 'currentColor' : 'none'} /></button>
          <button className="icon-button" aria-label="Compartilhar" onClick={async () => {
            try {
              if (navigator.share) await navigator.share({ title: course.title, text: course.description })
              else { await navigator.clipboard.writeText(course.title); setNotice('Título copiado.') }
            } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setNotice('Compartilhamento indisponível.') }
          }}><Share /></button>
        </div>
        <span className={'badge ' + (course.price ? 'paid' : 'free')}>{course.price ? money.format(course.price) : 'Gratuito'}</span>
      </div>
      <div className="detail-body">
        <h1>{course.title}</h1>
        <div className="meta detail-meta"><span>{course.id === 'ia' && <b className="google">G</b>}{course.provider}</span><span><Star className="star" /> {course.rating} ({course.reviews} avaliações)</span></div>
        <div className="facts"><span><Clock3 />{course.hours} horas</span><span><Monitor />Online</span><span><Bookmark />Certificado</span></div>
        <div className="detail-tabs">{['Sobre', 'Conteúdo', 'Avaliações'].map(tab => <button key={tab} aria-pressed={detailTab === tab} onClick={() => setDetailTab(tab)}>{tab}</button>)}</div>
        {detailTab === 'Sobre' ? <>
          <h2>Descrição</h2><p>{course.description}</p>
          <div className="tags"><span>{course.category}</span><span>{course.topic}</span><span>Online</span></div>
          <div className="detail-facts">
            <div><FileText /><span><strong>Certificado de conclusão</strong>Emita seu certificado ao finalizar o curso.</span></div>
            <div><GraduationCap /><span><strong>Requerimentos</strong>Nenhum pré-requisito</span></div>
            <div><Landmark /><span><strong>Reconhecimento</strong>Instituições no catálogo de demonstração: {course.institutions.join(', ')}. Confirme a validação com sua instituição.</span></div>
            <div><Clock3 /><span><strong>Carga horária</strong>{course.hours} horas</span></div>
          </div>
        </> : detailTab === 'Conteúdo' ? <><h2>Conteúdo</h2><p>{course.description}</p><p>Modalidade online · {course.hours} horas</p></> : <><h2>Avaliações</h2><p>{course.rating} de 5 · {course.reviews} avaliações de demonstração</p></>}
        {notice && <p role="status">{notice}</p>}
        <button className="primary with-arrow enroll" disabled={status === 'complete'} onClick={() => {
          save({ ...session, enrollments: { ...session.enrollments, [course.id]: status === 'active' ? 'complete' : 'active' } })
          setNotice(status === 'active' ? 'Horas adicionadas em Minhas Horas.' : 'Inscrição registrada nesta sessão.')
        }}>{status === 'complete' ? 'Curso concluído' : status === 'active' ? 'Marcar como concluído' : 'Inscrever-se'}<ArrowRight size={18} /></button>
      </div>
    </main>
  }

  const filtered = courses.filter(course => (category === 'Todas' || course.category === category) &&
    normalize(course.title + ' ' + course.topic + ' ' + course.provider).includes(normalize(query.trim())) &&
    (!institution || course.institutions.includes(institution)) &&
    (!duration || (duration === 'short' ? course.hours <= 20 : course.hours > 20)) &&
    (!price || (price === 'free' ? course.price === 0 : course.price > 0)))
  const favorites = ['ia', 'oratoria', 'excel', 'foto', 'saude', 'projetos', 'marketing'].flatMap(id => {
    const course = courses.find(item => item.id === id)
    return course && session.favorites.includes(id) && (favoritesTab === 'Todos' || course.type === favoritesTab) ? [course] : []
  })
  const enrolled = courses.filter(course => session.enrollments[course.id] && (!institution || page !== 'hours' || course.institutions.includes(institution)))
  const completed = enrolled.filter(course => session.enrollments[course.id] === 'complete')
  const hours = completed.reduce((total, course) => total + course.hours, 0)
  const active = enrolled.filter(course => session.enrollments[course.id] === 'active').reduce((total, course) => total + course.hours, 0)
  const pending = Math.max(0, 200 - hours)
  const percent = Math.min(100, Math.round(hours / 2))

  return <div className="shell app">
    <header>
      <button className="icon-button" aria-label="AcadUp, início" onClick={() => navigate('home')}>{brand}</button>
      <button className="icon-button bell" aria-label="Notificações" aria-expanded={notifications} onClick={() => setNotifications(!notifications)}><Bell size={20} /><i /></button>
      <button className="icon-button avatar" aria-label="Perfil" onClick={() => navigate('profile')}><img src={image('profile')} alt="" /></button>
    </header>
    {notifications && <aside className="notification"><strong>Nova oportunidade</strong><button className="text-button" onClick={() => { setNotifications(false); open(courses[0]) }}>{courses[0].title}</button></aside>}
    <main className="content">
      {page === 'home' && <>
        <section className="hero">
          <div><h1>Amplie seu<br />conhecimento</h1><p>Descubra cursos, eventos e atividades<br />para complementar sua formação.</p></div>
          <button className="icon-button" aria-label="Explorar cursos" onClick={() => explore()}><ArrowRight size={17} /></button>
        </section>
        <form className="search" onSubmit={event => { event.preventDefault(); explore('Todas', String(new FormData(event.currentTarget).get('search'))) }}>
          <label className="field"><Search /><input name="search" aria-label="Buscar cursos e atividades" placeholder="Buscar cursos, atividades..." /></label>
          <button className="icon-button" type="submit" aria-label="Buscar"><Search size={17} /></button>
          <button className="icon-button" type="button" aria-label="Filtros" onClick={() => explore('Todas', '', true)}><SlidersHorizontal size={17} /></button>
        </form>
        <div className="categories">{categories.map((item, index) => {
          const Icon = categoryIcons[index]
          return <button key={item} onClick={() => explore(item)}><span><Icon size={22} /></span>{item}</button>
        })}</div>
        <div className="section-title"><h2>Destaques para você</h2><button className="text-button" onClick={() => explore()}>Ver todos</button></div>
        <div className="grid">{courses.slice(0, 2).map(course => courseCard(course, 'feature'))}</div>
        <div className="section-title"><h2>Cursos mais buscados</h2><button className="text-button" onClick={() => explore()}>Ver todos</button></div>
        <div className="grid">{courses.slice(2, 4).map(course => courseCard(course, 'popular'))}</div>
      </>}
      {page === 'explore' && <>
        <h1>Explorar</h1>
        <div className="search"><label className="field"><Search /><input aria-label="Buscar cursos" placeholder="Buscar cursos, atividades..." value={query} onChange={event => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Filtros" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={19} /></button></div>
        {showFilters && <div className="filters">
          <label>Área<select value={category} onChange={event => setCategory(event.target.value)}>{['Todas', ...categories].map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Carga horária<select value={duration} onChange={event => setDuration(event.target.value)}><option value="">Todas</option><option value="short">Até 20 horas</option><option value="long">Mais de 20 horas</option></select></label>
          <label>Preço<select value={price} onChange={event => setPrice(event.target.value)}><option value="">Todos</option><option value="free">Gratuito</option><option value="paid">Pago</option></select></label>
          <label>Instituição<select value={institution} onChange={event => setInstitution(event.target.value)}><option value="">Todas</option>{institutions.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>}
        {!showFilters && category !== 'Todas' && <button className="text-button" onClick={() => setCategory('Todas')}>{category} ×</button>}
        <div className="stack">{filtered.map(course => courseCard(course, 'list'))}</div>
        {!filtered.length && <p className="empty">Nenhum curso ou atividade encontrado.</p>}
      </>}
      {page === 'favorites' && <>
        <h1>Favoritos</h1>
        <div className="segments">{['Todos', 'Cursos', 'Eventos', 'Atividades'].map(tab => <button key={tab} aria-pressed={favoritesTab === tab} onClick={() => setFavoritesTab(tab)}>{tab}</button>)}</div>
        <div className="stack">{favorites.map(course => courseCard(course, 'list'))}</div>
        {!favorites.length && <p className="empty">Você ainda não tem favoritos nesta categoria.</p>}
      </>}
      {page === 'hours' && <>
        <div className="hours-heading"><h1>Minhas Horas</h1><select aria-label="Instituição" value={institution} onChange={event => setInstitution(event.target.value)}><option value="">Todas as instituições</option>{institutions.map(item => <option key={item}>{item}</option>)}</select></div>
        <div className="hours-summary">
          <div className="ring" style={{ background: 'conic-gradient(#4b20f5, #925dff ' + percent + '%, #e4dcfb 0)' }}><div><span><strong>{hours}</strong> / 200</span><span>horas</span><small>{percent}% concluído</small></div></div>
          <div className="totals"><div><Check /><span>Concluídas<strong>{hours} horas</strong></span></div><div><Clock3 /><span>Em andamento<strong>{active} horas</strong></span></div><div><Clock3 /><span>Faltam<strong>{pending} horas</strong></span></div></div>
        </div>
        <button className="goal" onClick={() => explore()}><Target /><span><strong>Você está no caminho certo!</strong>{pending ? 'Complete mais ' + pending + ' horas para atingir o requisito da sua instituição.' : 'Você atingiu sua meta de 200 horas.'}</span><ChevronRight /></button>
        <div className="segments hour-tabs">{['Meus cursos', 'Certificados', 'Histórico'].map(tab => <button key={tab} aria-pressed={hoursTab === tab} onClick={() => setHoursTab(tab)}>{tab}</button>)}</div>
        <div className="stack">{(hoursTab === 'Meus cursos' ? enrolled : completed).map(course => courseCard(course, 'list'))}</div>
        {!(hoursTab === 'Meus cursos' ? enrolled : completed).length && <p className="empty">{hoursTab === 'Meus cursos' ? 'Inscreva-se em um curso para acompanhar suas horas.' : 'Conclua um curso para vê-lo aqui.'}</p>}
      </>}
      {page === 'profile' && <section className="profile"><h1>Perfil</h1><strong>{session.profile?.name ?? 'Visitante'}</strong>{session.profile && <p>{session.profile.email}</p>}<button className="outline" onClick={() => { if (session.profile) clear(); showAuth(session.profile ? 'welcome' : 'login') }}>{session.profile ? 'Sair' : 'Entrar'}</button></section>}
    </main>
    <nav aria-label="Navegação principal">{navigation.map(({ id, label, icon: Icon }) => <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => { if (id === 'explore') explore(); else { if (id === 'hours') setInstitution(''); navigate(id) } }}><Icon size={20} fill={page === id && (id === 'home' || id === 'favorites') ? 'currentColor' : 'none'} />{label}</button>)}</nav>
  </div>
}
