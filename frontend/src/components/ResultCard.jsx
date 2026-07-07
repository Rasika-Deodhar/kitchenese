import SpiceMeter from "./SpiceMeter";
import { getLabels } from "../labels";
import { getCuisineTheme } from "../cuisineThemes";

export default function ResultCard({ result, mode, cuisine, onPairsClick }) {
  const labels = getLabels(mode);
  const theme = getCuisineTheme(cuisine);

  return (
    <div className="result-card">
      <div className="result-card__stripe" aria-hidden="true">
        {theme.stripe.map((c, i) => (
          <div key={i} style={{ background: c }} />
        ))}
      </div>

      <div className="result-card__body">
        <div className="result-card__doodle" aria-hidden="true">
          {theme.emoji}
        </div>

        <div className="result-card__header">
          <span className="result-card__eyebrow">
            {labels.cardTitle} · <span className="result-card__greeting">{theme.greeting}</span>
          </span>
          <span className="badge badge--concept">{result.concept}</span>
        </div>

        <h2 className="result-card__dish">{result.dish_name}</h2>
        <SpiceMeter level={result.spice_level} />
        <p className="result-card__one-liner">{result.one_liner}</p>

        <section className="result-card__section">
          <h3 className="result-card__section-title">{labels.ingredients}</h3>
          <ul className="ingredients-list">
            {result.ingredients.map((ing, i) => (
              <li key={i} className="ingredients-list__item">
                <span className="ingredients-list__kitchen">{ing.kitchen}</span>
                <span className="ingredients-list__arrow">→</span>
                <span className="ingredients-list__tech">{ing.tech}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="result-card__section">
          <h3 className="result-card__section-title">{labels.method}</h3>
          <ol className="method-list">
            {result.method.map((step, i) => (
              <li key={i} className="method-list__item">
                <span
                  className="method-list__num"
                  style={{
                    background: theme.numberColors[i % theme.numberColors.length],
                    color: theme.numberText,
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="result-card__note">
          <h3 className="result-card__section-title">{labels.note}</h3>
          <p>{result.chefs_note}</p>
        </section>

        {result.pairs_with?.length > 0 && (
          <section className="result-card__section">
            <h3 className="result-card__section-title">{labels.pairs}</h3>
            <div className="pairs-chips">
              {result.pairs_with.map((pair) => (
                <button
                  key={pair}
                  type="button"
                  className="chip chip--pair"
                  onClick={() => onPairsClick(pair)}
                >
                  {pair}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
