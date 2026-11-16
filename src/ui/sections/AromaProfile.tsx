import { NOTE_TIERS } from '../../data/products'
import { useActiveVariant } from '../../state/store'
import { NoteIcon } from '../components/Icons'
import { Reveal } from '../components/Reveal'

export function AromaProfile() {
  const variant = useActiveVariant()

  return (
    <section id="aroma" data-section="aroma" className="section section--right" aria-labelledby="aroma-title">
      <Reveal className="panel">
        <p className="eyebrow">Profil Aroma</p>
        <h2 id="aroma-title" className="section-title">
          Tiga babak <em>{variant.name}</em>
        </h2>
        <p className="lede">
          Parfum terungkap perlahan. Kesan pertama memudar menjadi jiwa aroma, lalu meninggalkan jejak yang menempel
          di kulit hingga malam.
        </p>

        <ol className="note-tiers" key={variant.id}>
          {NOTE_TIERS.map((tier, t) => (
            <li key={tier.key} className={`note-tier note-tier--${tier.key}`}>
              <div className="note-tier__head">
                <span className="note-tier__index" aria-hidden="true">
                  0{t + 1}
                </span>
                <div>
                  <h3 className="note-tier__title">
                    {tier.label}
                    <span> — {tier.title}</span>
                  </h3>
                  <p className="note-tier__timing">{tier.timing}</p>
                </div>
              </div>
              <ul className="note-list">
                {variant.notes[tier.key].map((note, i) => (
                  <li key={note.name} className="note-card" style={{ animationDelay: `${t * 90 + i * 60}ms` }}>
                    <span className="note-card__icon">
                      <NoteIcon icon={note.icon} size={26} />
                    </span>
                    <span className="note-card__text">
                      <strong>{note.name}</strong>
                      <span>{note.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
