import { useState } from 'react';
import styles from './SpiceFreshnessCalculator.module.css';
import calculatorData from '../../data/spice_freshness_calculator_data.json';

// Type definitions for the JSON data structure
interface SpiceType {
  id: string;
  name: string;
  common_forms: string[];
  shelf_life_months: number;
  storage_bonus: Record<string, number>;
  quality_factors: Record<string, string>;
}

// Result State Interface
interface FreshnessResult {
  score: number;
  status: {
    emoji: string;
    text: string;
    level: string;
  };
  recommendation: string;
  shelfLifeRemaining: number;
  spiceName: string;
  storageAdvice: {
    temperature: string;
    ideal_container: string;
    benefits: string[];
    downsides: string[];
    best_for: string[];
  };
  tips: string[];
}

export default function SpiceFreshnessCalculator() {
  // Form state
  const [spiceType, setSpiceType] = useState('');
  const [ageMonths, setAgeMonths] = useState(1);
  const [storageMethod, setStorageMethod] = useState('airtight_container');
  const [visualScore, setVisualScore] = useState(3);
  const [aromaScore, setAromaScore] = useState(3);
  const [calculated, setCalculated] = useState(false);

  // Result state
  const [result, setResult] = useState<FreshnessResult | null>(null);

  // Calculate freshness score
  const calculateFreshness = () => {
    if (!spiceType) {
      alert('Please select a spice type');
      return;
    }

    const spice = (calculatorData.spice_types as SpiceType[]).find((s) => s.id === spiceType);
    if (!spice) return; // Should not happen

    const shelfLife = spice.shelf_life_months;

    // Algorithm from data
    const baseScore = 100;

    // Age penalty
    const agePenalty = (ageMonths / shelfLife) * 30;

    // Visual penalty
    const visualPenalty = (5 - visualScore) * 10;

    // Aroma penalty
    const aromaPenalty = (5 - aromaScore) * 15;

    // Storage bonus
    const storageBonus = spice.storage_bonus[storageMethod] || 0;

    // Calculate final score (capped at 0-100)
    const finalScore = Math.max(
      0,
      Math.min(100, baseScore - agePenalty - visualPenalty - aromaPenalty + storageBonus)
    );

    // Determine status
    let status = { emoji: '', text: '', level: '' };
    if (finalScore >= 80) {
      status = { emoji: '✅', text: 'Excellent', level: 'excellent' };
    } else if (finalScore >= 60) {
      status = { emoji: '👍', text: 'Good', level: 'good' };
    } else if (finalScore >= 40) {
      status = { emoji: '⚠️', text: 'Fair', level: 'fair' };
    } else if (finalScore >= 20) {
      status = { emoji: '❌', text: 'Poor', level: 'poor' };
    } else {
      status = { emoji: '🚫', text: 'Expired', level: 'expired' };
    }

    // Determine recommendation
    const recommendations: Record<string, string> = {
      excellent: 'Use immediately! Peak flavor and aroma. Enjoy your spice at its best.',
      good: 'Good to use. Consider replacing within 1-2 months for optimal flavor.',
      fair: 'Still usable but losing quality. Replace soon for better taste.',
      poor: 'Consider replacing. Flavor is compromised.',
      expired: 'Replace immediately. Health and safety risk.',
    };

    // Calculate shelf life remaining
    const shelfLifeRemaining = Math.max(0, shelfLife - ageMonths);

    setResult({
      score: Math.round(finalScore),
      status,
      recommendation: recommendations[status.level],
      shelfLifeRemaining,
      spiceName: spice.name,
      storageAdvice: getStorageAdvice(storageMethod),
      tips: generateTips(spice, ageMonths, storageMethod, finalScore),
    });

    setCalculated(true);
  };

  const getStorageAdvice = (method: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const advice = (calculatorData.storage_recommendations.by_storage_type as any)[method];
    return advice;
  };

  const generateTips = (spice: SpiceType, age: number, storage: string, score: number) => {
    const tips = [];

    // Tip 1: Based on spice type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spiceAdvice = (calculatorData.spice_specific_storage as any)[spice.id];
    if (spiceAdvice) {
      tips.push(`💡 ${spice.name}: ${spiceAdvice.why_sensitive}`);
    }

    // Tip 2: Based on storage
    if (storage === 'open_container' || storage === 'normal_shelf') {
      tips.push('⚠️ Consider moving to airtight container to extend shelf life by 50%+');
    } else if (storage === 'freezer') {
      tips.push('✅ Great choice! Freezer storage significantly extends freshness.');
    }

    // Tip 3: Age-based
    if (age > spice.shelf_life_months * 0.8) {
      tips.push('🔔 This spice is nearing end of shelf life. Plan a replacement soon.');
    }

    // Tip 4: If poor/expired
    if (score < 40) {
      tips.push('🛒 Shop fresh spices at Tattva Co. | Lab-tested, farm-direct quality');
    }

    return tips;
  };

  const resetCalculator = () => {
    setSpiceType('');
    setAgeMonths(1);
    setStorageMethod('airtight_container');
    setVisualScore(3);
    setAromaScore(3);
    setCalculated(false);
    setResult(null);
  };

  return (
    <div className={styles.spiceCalculatorContainer}>
      <div className={styles.calculatorCard}>
        {!calculated ? (
          // FORM VIEW
          <>
            <div className={styles.calculatorHeader}>
              <h2>🌶️ Spice Freshness Calculator</h2>
              <p>Check if your spices are still fresh and flavorful</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="spice-select">1. What spice do you have?</label>
              <select
                id="spice-select"
                value={spiceType}
                onChange={(e) => setSpiceType(e.target.value)}
                className={styles.formInput}
              >
                <option value="">Select a spice...</option>
                {calculatorData.spice_types.map((spice) => (
                  <option key={spice.id} value={spice.id}>
                    {spice.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="age-input">2. How old is it? ({ageMonths} months)</label>
              <input
                id="age-input"
                type="range"
                min="0"
                max="36"
                value={ageMonths}
                onChange={(e) => setAgeMonths(parseInt(e.target.value))}
                className={styles.formSlider}
              />
              <div className={styles.sliderLabels}>
                <span>0</span>
                <span>36</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="storage-select">3. Where do you store it?</label>
              <select
                id="storage-select"
                value={storageMethod}
                onChange={(e) => setStorageMethod(e.target.value)}
                className={styles.formInput}
              >
                <option value="freezer">❄️ Freezer</option>
                <option value="airtight_container">🏺 Airtight Container (Room Temp)</option>
                <option value="fridge">🧊 Refrigerator</option>
                <option value="normal_shelf">📦 Regular Shelf</option>
                <option value="open_container">🪣 Open Container</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="visual-slider">4. How does it look?</label>
              <div className={styles.visualIndicator}>
                <span className={styles.faded}>Very Faded</span>
                <input
                  id="visual-slider"
                  type="range"
                  min="1"
                  max="5"
                  value={visualScore}
                  onChange={(e) => setVisualScore(parseInt(e.target.value))}
                  className={`${styles.formSlider} ${styles.colorSlider}`}
                />
                <span className={styles.vibrant}>Vibrant & Fresh</span>
              </div>
              <p className={styles.sliderValue}>
                {
                  ['', 'Very faded', 'Noticeably faded', 'Somewhat faded', 'Good color', 'Vibrant'][
                    visualScore
                  ]
                }
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="aroma-slider">5. How does it smell?</label>
              <div className={styles.visualIndicator}>
                <span className={styles.weak}>No Aroma</span>
                <input
                  id="aroma-slider"
                  type="range"
                  min="1"
                  max="5"
                  value={aromaScore}
                  onChange={(e) => setAromaScore(parseInt(e.target.value))}
                  className={`${styles.formSlider} ${styles.aromaSlider}`}
                />
                <span className={styles.strong}>Strong Aroma</span>
              </div>
              <p className={styles.sliderValue}>
                {
                  [
                    '',
                    'No aroma / stale',
                    'Very faint',
                    'Noticeable but weak',
                    'Good aroma',
                    'Strong & distinctive',
                  ][aromaScore]
                }
              </p>
            </div>

            <button onClick={calculateFreshness} className={styles.calculateBtn}>
              Calculate Freshness Score →
            </button>

            <div className={styles.infoBox}>
              <h3>💡 How this works:</h3>
              <p>
                We analyze your spice&apos;s age, storage conditions, color, and aroma to give you a
                freshness score (0-100). Use this to decide whether to keep or replace.
              </p>
            </div>
          </>
        ) : (
          // RESULT VIEW
          <>
            <div className={styles.resultContainer}>
              <div className={styles.resultHeader}>
                <div className={styles.resultScore}>
                  <span className={styles.scoreNumber}>{result?.score}</span>
                  <span className={styles.scoreMax}>/100</span>
                </div>
                <div className={styles.resultStatus}>
                  <span className={styles.emoji}>{result?.status.emoji}</span>
                  <span className={styles.statusText}>{result?.status.text}</span>
                </div>
              </div>

              <div className={styles.resultSpice}>
                <h3>You tested: {result?.spiceName}</h3>
                <p className={styles.resultRecommendation}>{result?.recommendation}</p>
              </div>

              <div className={styles.resultInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>📅 Shelf Life Remaining:</span>
                  <span className={styles.value}>
                    {(result?.shelfLifeRemaining || 0) > 0
                      ? `${result?.shelfLifeRemaining} months`
                      : 'Expired'}
                  </span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.label}>🏺 Your Storage Method:</span>
                  <span className={`${styles.value} ${styles.capitalize}`}>
                    {result?.storageAdvice.benefits[0]}
                  </span>
                </div>
              </div>

              <div className={styles.tipsSection}>
                <h4>💡 Personalized Tips for You:</h4>
                <ul className={styles.tipsList}>
                  {result?.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.storageBox}>
                <h4>🏠 Optimize Your Storage:</h4>
                <p>
                  <strong>Best container:</strong> {result?.storageAdvice.ideal_container}
                </p>
                <ul>
                  {result?.storageAdvice.benefits.map((benefit, idx) => (
                    <li key={idx}>✅ {benefit}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.ctaBox}>
                <h4>🌶️ Need Fresh Spices?</h4>
                <p>Tattva Co. delivers lab-tested, farm-direct spices with guaranteed freshness.</p>
                <a href="/shop" className={styles.ctaButton}>
                  Shop Fresh Spices at Tattva Co →
                </a>
              </div>

              <button onClick={resetCalculator} className={styles.resetBtn}>
                ← Check Another Spice
              </button>
            </div>
          </>
        )}
      </div>

      <div className={styles.calculatorFooter}>
        <p>
          💡 <strong>Pro Tip:</strong> Store spices in airtight containers in cool, dark places.
          Freezer storage extends freshness by up to 50%.
        </p>
      </div>
    </div>
  );
}
