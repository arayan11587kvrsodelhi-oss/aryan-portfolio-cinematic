import { useState, useMemo } from 'react'
import {
  githubRepos,
  REPO_CATEGORIES,
  LANGUAGE_COLORS,
  GITHUB_PROFILE_URL,
  type GitHubRepo,
  type RepoCategory
} from '../data/githubRepos'
import RepoDetailModal from './RepoDetailModal'

export default function RepositoryArchive() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalRepo, setActiveModalRepo] = useState<GitHubRepo | null>(null)
  const [hoveredRepo, setHoveredRepo] = useState<GitHubRepo | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const filteredRepos = useMemo(() => {
    return githubRepos.filter((repo) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        (selectedCategory === 'FEATURED' ? repo.isFeatured : repo.category === selectedCategory)

      const matchesSearch =
        searchQuery === '' ||
        repo.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.primaryLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: githubRepos.length }
    counts['FEATURED'] = githubRepos.filter((r) => r.isFeatured).length
    for (const cat of REPO_CATEGORIES) {
      if (cat !== 'FEATURED') {
        counts[cat] = githubRepos.filter((r) => r.category === cat).length
      }
    }
    return counts
  }, [])

  return (
    <section id="archive" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">[ 03. ARCHIVE ]</span>
          <span className="h-[1px] w-12 bg-white/10" />
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {githubRepos.length} Repositories Cataloged
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-white tracking-tight">
              REPOSITORY ARCHIVE
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl font-mono">
              Complete index of every public repository under{' '}
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-400 underline underline-offset-4 decoration-white/20 transition-colors"
              >
                @arayan11587kvrsodelhi-oss
              </a>
              . Filter by category or search by technology.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all"
            >
              <span>OPEN GITHUB PROFILE</span>
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'FEATURED', ...REPO_CATEGORIES.filter((c) => c !== 'FEATURED')].map((cat) => {
            const count = categoryCounts[cat] || 0
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] max-w-sm">
          <input
            type="text"
            placeholder="Search by name, language, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Archive Table */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3.5 border-b border-white/10 bg-white/[0.02] text-xs font-mono text-white/40 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Repository / Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/5">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo, idx) => {
              const langColor = LANGUAGE_COLORS[repo.primaryLanguage] || '#888'
              const numStr = String(idx + 1).padStart(2, '0')

              return (
                <div
                  key={repo.id}
                  onMouseEnter={() => setHoveredRepo(repo)}
                  onMouseLeave={() => setHoveredRepo(null)}
                  onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                  className="group relative flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors items-start md:items-center"
                >
                  {/* Number */}
                  <div className="col-span-1 text-xs font-mono text-white/30 group-hover:text-emerald-400 transition-colors">
                    {numStr}
                  </div>

                  {/* Title & Description preview */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalRepo(repo)}
                        className="text-left font-display font-medium text-white text-sm sm:text-base hover:text-emerald-300 transition-colors"
                      >
                        {repo.displayName}
                      </button>
                      {repo.isFeatured && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-white/40 truncate max-w-md mt-0.5">
                      {repo.name} · {repo.description}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 text-white/70 border border-white/5">
                      {repo.category}
                    </span>
                  </div>

                  {/* Language */}
                  <div className="col-span-2 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: langColor }}
                    />
                    <span className="text-xs font-mono text-white/80">{repo.primaryLanguage}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex items-center justify-start md:justify-end gap-2 w-full mt-2 md:mt-0">
                    {repo.demoUrl && (
                      <a
                        href={repo.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all flex items-center gap-1"
                        title="Open Live Experience"
                      >
                        <span>LIVE</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    )}

                    <button
                      onClick={() => setActiveModalRepo(repo)}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
                    >
                      DETAILS
                    </button>

                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center gap-1"
                      title="Open GitHub Repository"
                    >
                      <span>GITHUB</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-16 text-center text-white/40 font-mono text-sm">
              No repositories match the filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Floating Hover Preview Card (Desktop) */}
      {hoveredRepo && (
        <div
          className="fixed pointer-events-none z-40 hidden lg:block w-72 rounded-xl overflow-hidden border border-white/20 bg-[#0d0e12]/95 backdrop-blur-xl shadow-2xl p-3 transition-opacity duration-200"
          style={{
            left: `${mousePos.x + 24}px`,
            top: `${mousePos.y - 80}px`
          }}
        >
          {hoveredRepo.previewImage ? (
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden mb-2.5 bg-black/50 border border-white/10">
              <img
                src={hoveredRepo.previewImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full rounded-lg mb-2.5 bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white/40">
              {hoveredRepo.primaryLanguage} Repository
            </div>
          )}
          <div className="font-display font-medium text-white text-xs mb-1">
            {hoveredRepo.displayName}
          </div>
          <p className="text-[11px] font-mono text-white/60 line-clamp-2 mb-2">
            {hoveredRepo.description}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1.5 border-t border-white/10">
            <span>{hoveredRepo.category}</span>
            <span className="text-emerald-400">GITHUB LINK ↗</span>
          </div>
        </div>
      )}

      {/* Detail Modal Overlay */}
      <RepoDetailModal repo={activeModalRepo} onClose={() => setActiveModalRepo(null)} />
    </section>
  )
}
