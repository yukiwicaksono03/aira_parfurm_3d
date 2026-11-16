import { useActiveVariant } from '../../state/store'
import { Reveal } from '../components/Reveal'

export function Story() {
  const variant = useActiveVariant()
  const { story } = variant

  const blocks = [
    { title: 'Inspirasi', body: story.inspiration },
    { title: 'Karakter', body: story.character },
    { title: 'Suasana', body: story.atmosphere },
  ]

  return (
    <section id="cerita" data-section="cerita" className="section section--left" aria-labelledby="cerita-title">
      <Reveal className="panel panel--story">
        <p className="eyebrow">Cerita Parfum</p>
        <h2 id="cerita-title" className="sr-only">
          Cerita di balik {variant.name}
        </h2>
        <blockquote className="story-quote" key={variant.id}>
          <p>{story.quote}</p>
        </blockquote>

        <div className="story-grid">
          {blocks.map((b) => (
            <article key={b.title} className="story-block">
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </article>
          ))}
        </div>

        <ul className="mood-list" aria-label="Suasana yang dihadirkan">
          {variant.mood.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
