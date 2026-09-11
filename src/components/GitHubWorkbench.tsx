import { useState, useMemo } from 'react'
import {
  ExternalLink,
  Github,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight,
  Terminal,
  ShieldCheck,
  Code2,
  FolderGit2
} from 'lucide-react'
import {
  githubRepos,
  LANGUAGE_COLORS,
  REPO_CATEGORIES,
  GITHUB_PROFILE_URL,
  type GitHubRepo,
  type RepoCategory
} from '../data/githubRepos'
import RepoDetailModal from './RepoDetailModal'
import { useSFX } from '../hooks/useSFX'

export default function GitHubWorkbench() {
  const { playSFX } = useSFX()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRepo, setActiveRepo] = useState<GitHubRepo | null>(null)
  const [hoveredRepoId, setHoveredRepoId] = useState<string | null>(null)

  // Truthful metrics derived directly from the GitHub snapshot dataset
  const totalRepos = githubRepos.length
  const publishedDemoCount = githubRepos.filter((r) => r.demoUrl).length
  const primaryLanguageCount = new Set(githubRepos.map((r) => r.primaryLanguage)).size

  // Canonical Featured Projects (The 5 flagship repositories marked isFeatured in dataset)
  const featuredRepos = useMemo(() => {
    return githubRepos.filter((r) => r.isFeatured)
  }, [])

  const languages = useMemo(() => {
    const set = new Set<string>()
    githubRepos.forEach((r) => set.add(r.primaryLanguage))
    return ['ALL', ...Array.from(set)]
  }, [])

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {}
    githubRepos.forEach((r) => {
      counts[r.primaryLanguage] = (counts[r.primaryLanguage] || 0) + 1
    })
    return counts
  }, [])

  // All repositories for search & filter grid
  const allFilteredRepos = useMemo(() => {
    return githubRepos.filter((repo) => {
      const matchesLanguage =
        selectedLanguage === 'ALL' || repo.primaryLanguage === selectedLanguage

      const matchesCategory =
        selectedCategory === 'ALL' ||
        (selectedCategory === 'FEATURED' ? repo.isFeatured : repo.category === selectedCategory)

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        repo.displayName.toLowerCase().includes(q) ||
        repo.name.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        repo.technologies.some((t) => t.toLowerCase().includes(q)) ||
        repo.category.toLowerCase().includes(q)

      return matchesLanguage && matchesCategory && matchesSearch
    })
  }, [selectedLanguage, selectedCategory, searchQuery])

  // Functional domains
  const functionalDomains = [
    {
      title: 'Defensive Security & Threat Intelligence',
      repos: ['sentinel-soc', 'auth-client', 'aryan-portfolio-auth'],
      color: '#10b981',
      desc: 'Telemetry streams, vulnerability intelligence (NIST NVD + CISA KEV), incident response, and authentication state.'
    },
    {
      title: 'Fintech & Transaction Telemetry',
      repos: ['velora-fintech-landing-page', 'currpense'],
      color: '#3b82f6',
      desc: 'High-clarity financial dashboards, multi-currency ledger recalculation, and savings vault logic.'
    },
    {
      title: 'Developer Intelligence & Tools',
      repos: ['nexus-dashboard', 'calc'],
      color: '#f59e0b',
      desc: 'GitHub REST API analytics proxying, activity tracking, and mathematical calculation parsers.'
    },
    {
      title: 'Creative Frontend & Storytelling',
      repos: ['amber-hour', 'aryan-portfolio-cinematic', 'portfolio-card', 'nissan-gtr-clone', 'Responsive-Business-Landing-Page', 'aryan', 'portfolio'],
      color: '#8b5cf6',
      desc: 'Cinematic scrolling choreography, GSAP timelines, responsive editorial layouts, and WebGL studies.'
    }
  ]

  return (
    <section id="workbench" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-accent uppercase tracking-widest">[ 03. PROJECTS & WORKBENCH ]</span>
          <span className="h-[1px] w-12 bg-white/10" />
          <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
            Definitive Project Showcase
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
              PROJECTS &amp; WORKBENCH
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl font-mono leading-relaxed">
              A curated view of the real projects and repositories I&apos;ve built across frontend development, cybersecurity, full-stack applications, and interactive web experiences.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-white/40">GitHub Profile:</span>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSFX('click')}
              className="text-accent hover:text-white underline underline-offset-4 decoration-accent/40 transition-colors inline-flex items-center gap-1.5"
            >
              <span>arayan11587kvrsodelhi-oss</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Ecosystem Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Public Repositories</div>
          <div className="text-3xl sm:text-4xl font-display font-bold text-white">{totalRepos}</div>
          <div className="mt-1 text-[11px] font-mono text-accent">Active across GitHub</div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Primary Languages</div>
          <div className="text-3xl sm:text-4xl font-display font-bold text-white">{primaryLanguageCount}</div>
          <div className="mt-1 text-[11px] font-mono text-white/50">TypeScript · JS · HTML · CSS</div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Live Verified Demos</div>
          <div className="text-3xl sm:text-4xl font-display font-bold text-accent">{publishedDemoCount}</div>
          <div className="mt-1 text-[11px] font-mono text-white/50">Vercel · Render · GitHub Pages</div>
        </div>
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Architecture Domains</div>
          <div className="text-3xl sm:text-4xl font-display font-bold text-white">4</div>
          <div className="mt-1 text-[11px] font-mono text-white/50">Security · Fintech · Intel · Creative</div>
        </div>
      </div>

      {/* =========================================================================
          PART 1: FEATURED PROJECTS — Strong Visual Hierarchy
          What should a recruiter look at first?
          ========================================================================= */}
      <div className="mb-20">
        <div className="flex items-center justify-between gap-4 mb-8 pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-widest">
              [ FLAGSHIP HIGHLIGHTS ]
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white mt-1">
              Featured Projects
            </h3>
          </div>
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider hidden sm:inline-block">
            {featuredRepos.length} Flagship Systems
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredRepos.map((repo, idx) => {
            const langColor = LANGUAGE_COLORS[repo.primaryLanguage] || '#888'
            const isFirstLarge = idx === 0

            return (
              <article
                key={repo.id}
                onMouseEnter={() => {
                  setHoveredRepoId(repo.id)
                  playSFX('hover')
                }}
                onMouseLeave={() => setHoveredRepoId(null)}
                onClick={() => {
                  playSFX('click')
                  setActiveRepo(repo)
                }}
                className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isFirstLarge ? 'lg:col-span-2 bg-white/[0.04] border-accent/30 hover:border-accent/60' : 'bg-white/[0.03] border-white/10 hover:border-accent/50'
                } hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1`}
              >
                {/* Visual Banner */}
                {repo.previewImage && (
                  <div className={`overflow-hidden bg-black/40 border-b border-white/10 ${isFirstLarge ? 'aspect-[21/9] max-h-96' : 'aspect-[16/9]'}`}>
                    <img
                      src={repo.previewImage}
                      alt={`${repo.displayName} preview`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Status, Language, Category */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full bg-accent/10 border border-accent/30 text-accent font-medium">
                          {repo.status}
                        </span>
                        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-white/60">
                          {repo.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-white/60">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: langColor }} />
                        <span>{repo.primaryLanguage}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl sm:text-2xl font-display font-semibold text-white group-hover:text-accent transition-colors mb-3">
                      {repo.displayName}
                    </h4>

                    {/* Description */}
                    <p className="text-sm font-mono text-white/70 leading-relaxed mb-6">
                      {repo.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {repo.technologies.slice(0, isFirstLarge ? 7 : 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/5 border border-white/10 text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {repo.technologies.length > (isFirstLarge ? 7 : 5) && (
                        <span className="px-2 py-1 text-[11px] font-mono rounded-md bg-white/5 text-white/40">
                          +{repo.technologies.length - (isFirstLarge ? 7 : 5)} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Links / Triggers */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-4">
                      {repo.demoUrl && (
                        <a
                          href={repo.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation()
                            playSFX('click')
                          }}
                          className="inline-flex items-center gap-1.5 text-accent hover:text-white transition-colors"
                        >
                          <span>LIVE DEMO</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation()
                          playSFX('click')
                        }}
                        className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
                      >
                        <Github size={13} />
                        <span>SOURCE</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-accent group-hover:translate-x-0.5 transition-transform font-medium"
                    >
                      <span>INSPECT DETAILS</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          PART 2: ALL REPOSITORIES — Search, Filter & Complete Inventory
          What else have I built?
          ========================================================================= */}
      <div className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              [ COMPLETE CODEBASE INVENTORY ]
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white mt-1">
              All Repositories &amp; Tools
            </h3>
          </div>
          <span className="text-xs font-mono text-white/50">
            Showing {allFilteredRepos.length} of {totalRepos} repositories
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          {/* Top Row: Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, technology (e.g. FastAPI, Vite, Lenis), or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-xs sm:text-sm font-mono focus:outline-none focus:border-accent transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Bottom Row: Language Tabs & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-white/40 mr-1.5 hidden sm:inline">Languages:</span>
              {languages.map((lang) => {
                const count = lang === 'ALL' ? githubRepos.length : languageStats[lang] || 0
                const color = lang === 'ALL' ? '#ffffff' : LANGUAGE_COLORS[lang] || '#888'
                const isSelected = selectedLanguage === lang

                return (
                  <button
                    key={lang}
                    onClick={() => {
                      playSFX('click')
                      setSelectedLanguage(lang)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-accent text-background font-semibold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                    }`}
                  >
                    {lang !== 'ALL' && (
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                    )}
                    <span>{lang}</span>
                    <span className={`text-[10px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-black/20' : 'bg-white/10'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/40">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white/80 focus:outline-none focus:border-accent"
              >
                <option value="ALL">All Categories</option>
                {REPO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Repositories Grid */}
        {allFilteredRepos.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-white/40 text-sm">
            No repositories matched your search query. Try clearing filters or searching another keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFilteredRepos.map((repo) => {
              const langColor = LANGUAGE_COLORS[repo.primaryLanguage] || '#888'
              const isHovered = hoveredRepoId === repo.id

              return (
                <article
                  key={repo.id}
                  onMouseEnter={() => setHoveredRepoId(repo.id)}
                  onMouseLeave={() => setHoveredRepoId(null)}
                  onClick={() => {
                    playSFX('click')
                    setActiveRepo(repo)
                  }}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isHovered
                      ? 'border-accent/50 bg-white/[0.05] shadow-xl -translate-y-1'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActiveRepo(repo)
                    }
                  }}
                  aria-label={`Open details for ${repo.displayName}`}
                >
                  {/* Visual thumbnail if available */}
                  {repo.previewImage ? (
                    <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-black/20 aspect-[16/9]">
                      <img
                        src={repo.previewImage}
                        alt={`${repo.displayName} project preview`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] aspect-[16/9] flex items-center justify-center text-white/20">
                      <FolderGit2 size={32} />
                    </div>
                  )}

                  {/* Body Info */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                        <span className="text-white/60">{repo.primaryLanguage}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {repo.category}
                      </span>
                    </div>

                    <h4 className="text-base font-display font-semibold text-white group-hover:text-accent transition-colors mb-2">
                      {repo.displayName}
                    </h4>

                    <p className="text-xs font-mono text-white/60 line-clamp-2 leading-relaxed mb-4">
                      {repo.description}
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-white/40 text-[11px] truncate max-w-[200px]">
                      {repo.technologies.slice(0, 2).join(' · ')}
                      {repo.technologies.length > 2 && ' +more'}
                    </div>
                    <span className="text-accent text-xs font-mono group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>EXPLORE</span>
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          PART 3: ECOSYSTEM DOMAIN MAPPING — Architectural Competency
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-display font-semibold text-white">Ecosystem Domain Mapping</h3>
            <p className="text-xs font-mono text-white/50 mt-1">
              How the 15 repositories correlate into technical competencies.
            </p>
          </div>
          <span className="text-xs font-mono text-accent uppercase tracking-widest hidden sm:inline-block">
            ARCHITECTURAL COHERENCE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {functionalDomains.map((domain) => (
            <div
              key={domain.title}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.color }} />
                <h4 className="font-display font-medium text-white text-base">{domain.title}</h4>
              </div>
              <p className="text-xs font-mono text-white/60 mb-3 leading-relaxed">
                {domain.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {domain.repos.map((repoId) => {
                  const r = githubRepos.find((item) => item.id === repoId)
                  if (!r) return null
                  return (
                    <button
                      key={repoId}
                      onClick={() => {
                        playSFX('click')
                        setActiveRepo(r)
                      }}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 transition-colors"
                    >
                      {r.displayName} ↗
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Overlay */}
      <RepoDetailModal repo={activeRepo} onClose={() => setActiveRepo(null)} />
    </section>
  )
}
