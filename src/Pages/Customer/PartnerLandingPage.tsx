import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Bike, BusFront, ChefHat, ClipboardList, GraduationCap, Mail, MapPin, Phone, Store, UserRound } from 'lucide-react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import SkipLink from '../../Components/SkipLink'
import usePageMeta from '../../hooks/usePageMeta'
import { CONTACT_EMAIL } from '../../config'

type PartnerType = 'vendor' | 'rider'
type RiderKind = 'student' | 'shuttle'

const MATRIC_KEY_PATTERN = /^[a-zA-Z0-9\/-]$/
const VEHICLE_KEY_PATTERN = /^[a-zA-Z0-9 -]$/
const MATRIC_PATTERN = '[A-Z0-9][A-Z0-9/-]{3,18}[A-Z0-9]'
const VEHICLE_PATTERN = '[A-Z0-9][A-Z0-9 -]{3,10}[A-Z0-9]'

const filterMatricNumber = (value: string) => value
  .toUpperCase()
  .replace(/[^A-Z0-9\/-]/g, '')
  .replace(/^[^A-Z0-9]+/, '')
  .slice(0, 20)

const filterVehicleNumber = (value: string) => value
  .toUpperCase()
  .replace(/[^A-Z0-9 -]/g, '')
  .replace(/^[^A-Z0-9]+/, '')
  .replace(/\s{2,}/g, ' ')
  .slice(0, 12)

const validateRiderIdentifier = (kind: RiderKind, value: string) => {
  const identifier = value.trim()
  if (kind === 'student') {
    return /^(?=.*\d)[A-Z0-9][A-Z0-9\/-]{3,18}[A-Z0-9]$/.test(identifier)
      ? ''
      : 'That doesn’t look like a matric number. Use 5–20 characters with at least one number.'
  }
  return /^(?=.*[A-Z])(?=.*\d)[A-Z0-9][A-Z0-9 -]{3,10}[A-Z0-9]$/.test(identifier)
    ? ''
    : 'That doesn’t look like a vehicle number. Use 5–12 characters with at least one letter and one number.'
}

const blockInvalidKeys = (pattern: RegExp) => (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return
  if (!pattern.test(event.key)) event.preventDefault()
}

const partnerContent = {
  vendor: {
    typeLabel: 'FOR FOOD BUSINESSES',
    title: 'Let more people discover your food.',
    description: 'Bring your restaurant to ChowZilla and make your menu easier for customers to find.',
    image: '/images/vendor-kitchen.jpg',
    imageAlt: 'Chef preparing food in a warmly lit restaurant kitchen',
    features: [
      { icon: Store, title: 'Showcase your menu', text: 'Give customers a clear place to explore the dishes your kitchen offers.' },
      { icon: MapPin, title: 'Reach customers nearby', text: 'Help people looking for food discover your restaurant.' },
      { icon: ClipboardList, title: 'Keep the details clear', text: 'Share the menu, hours, and information customers need to order.' },
    ],
    steps: ['Tell us about your restaurant', 'Share your menu and details', 'Prepare to receive orders'],
    formHeading: 'Tell us about your restaurant',
    formIntro: 'Register your interest in joining ChowZilla as a vendor.',
    extraLabel: 'Restaurant name',
    extraName: 'restaurant',
  },
  rider: {
    typeLabel: 'FOR DELIVERY RIDERS',
    title: 'Bring great food to someone’s door.',
    description: 'Learn about delivering with ChowZilla and helping local orders find their way home.',
    image: '/images/rider-delivery-man.jpg',
    imageAlt: 'Delivery rider in uniform sitting on a motorcycle with a delivery bag',
    features: [
      { icon: Bike, title: 'Deliver around your area', text: 'Help connect nearby kitchens with the people who ordered from them.' },
      { icon: MapPin, title: 'Know where you’re going', text: 'Get the delivery details you need for each order.' },
      { icon: ClipboardList, title: 'A clear way to get started', text: 'Share your details and learn about the rider onboarding process.' },
    ],
    steps: ['Tell us about yourself', 'Review the onboarding details', 'Get ready to ride'],
    formHeading: 'Interested in riding with us?',
    formIntro: 'Register your interest in delivering with ChowZilla.',
    extraLabel: 'Your city or area',
    extraName: 'area',
  },
}

const PartnerLandingPage = ({ type }: { type: PartnerType }) => {
  const content = partnerContent[type]
  const [submitted, setSubmitted] = useState(false)
  const [riderKind, setRiderKind] = useState<RiderKind | ''>('')
  const [submittedRiderKind, setSubmittedRiderKind] = useState<RiderKind | null>(null)
  const [matricNumber, setMatricNumber] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [identifierError, setIdentifierError] = useState('')
  usePageMeta(
    type === 'vendor' ? 'Partner with ChowZilla — Restaurants' : 'Ride with ChowZilla — Delivery riders',
    content.description,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (type === 'rider') {
      if (riderKind !== 'student' && riderKind !== 'shuttle') return
      const identifier = riderKind === 'student' ? matricNumber : vehicleNumber
      const validationError = validateRiderIdentifier(riderKind, identifier)
      if (validationError) {
        setIdentifierError(validationError)
        return
      }
      setIdentifierError('')
      setSubmittedRiderKind(riderKind)
    }

    setSubmitted(true)
  }

  return (
    <div className={`partner-page partner-page-${type}`}>
      <SkipLink />
      <Navbar page={type} />
      <main id="main-content" tabIndex={-1}>

      <section className="partner-hero">
        <div className="partner-hero-copy">
          <span className="partner-kicker"><i /> {content.typeLabel}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div className="partner-hero-actions">
            <a className="partner-primary-button" href="#partner-interest">Get started</a>
            <a className="partner-secondary-link" href="#partner-steps">See how it works</a>
          </div>
        </div>
        <div className="partner-hero-visual">
          <div className="partner-image-orbit" />
          <img src={content.image} alt={content.imageAlt} />
          <span className="partner-image-note">{type === 'vendor' ? <Store size={16} /> : <Bike size={16} />}{type === 'vendor' ? 'Made with care' : 'Ready for the road'}</span>
        </div>
      </section>

      <section className="partner-benefits" id="partner-benefits" aria-labelledby="partner-benefits-heading">
        <div className="partner-section-heading">
          <span className="partner-kicker">A GOOD WAY FORWARD</span>
          <h2 id="partner-benefits-heading">Built around the people who make delivery happen.</h2>
          <p>{type === 'vendor'
            ? 'A simple starting point for restaurants that want to be part of ChowZilla.'
            : 'A clear starting point for riders interested in delivering with ChowZilla.'}</p>
        </div>
        <div className="partner-feature-grid">
          {content.features.map(({ icon: Icon, title, text }, index) => (
            <article className="partner-feature-card" key={title}>
              <span className="partner-feature-icon"><Icon size={22} /></span>
              <span className="partner-feature-number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partner-steps" id="partner-steps" aria-labelledby="partner-steps-heading">
        <div className="partner-section-heading">
          <span className="partner-kicker">GETTING STARTED</span>
          <h2 id="partner-steps-heading">A few steps to get the conversation going.</h2>
        </div>
        <div className="partner-step-grid">
          {content.steps.map((step, index) => (
            <article className="partner-step" key={step}>
              <span>0{index + 1}</span>
              <h3>{step}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="partner-interest-section" id="partner-interest" aria-labelledby="partner-interest-heading">
        <div className="partner-interest-copy">
          <span className="partner-kicker">LET’S TALK</span>
          <h2 id="partner-interest-heading">Be part of what’s next.</h2>
          <p>Share a few details and we’ll have a starting point for the onboarding conversation.</p>
          <span className="partner-interest-mark">{type === 'vendor' ? <ChefHat size={24} /> : <Bike size={24} />}</span>
        </div>
        <form className="partner-interest-form" onSubmit={handleSubmit} onChange={() => setSubmitted(false)}>
          <div className="partner-form-context">
            <span className="partner-form-context-icon">{type === 'vendor' ? <Store size={19} /> : <Bike size={19} />}</span>
            <span>{type === 'vendor' ? 'RESTAURANT PARTNER' : 'DELIVERY PARTNER'} <i /> INTEREST FORM</span>
          </div>
          <h3>{content.formHeading}</h3>
          <p>{content.formIntro}</p>
          {type === 'rider' && (
            <fieldset className="partner-rider-type">
              <legend>How are you joining as a rider?</legend>
              <div className="partner-rider-type-options">
                <label className={`partner-rider-type-option${riderKind === 'student' ? ' is-selected' : ''}`}>
                  <input type="radio" name="riderType" value="student" required checked={riderKind === 'student'} onChange={() => { setRiderKind('student'); setIdentifierError('') }} />
                  <span className="partner-rider-type-icon"><GraduationCap size={19} /></span>
                  <span><strong>Student</strong><small>Join with your matric details</small></span>
                </label>
                <label className={`partner-rider-type-option${riderKind === 'shuttle' ? ' is-selected' : ''}`}>
                  <input type="radio" name="riderType" value="shuttle" required checked={riderKind === 'shuttle'} onChange={() => { setRiderKind('shuttle'); setIdentifierError('') }} />
                  <span className="partner-rider-type-icon"><BusFront size={19} /></span>
                  <span><strong>Shuttle</strong><small>Join with your vehicle details</small></span>
                </label>
              </div>
            </fieldset>
          )}
          {type === 'rider' && riderKind && (
            <div className={`partner-field${identifierError ? ' has-error' : ''}`}>
              <label htmlFor="rider-identifier">{riderKind === 'student' ? 'Matric number' : 'Vehicle number'}</label>
              <span className="partner-input-wrap">
                {riderKind === 'student' ? <GraduationCap size={16} /> : <BusFront size={16} />}
                {riderKind === 'student' ? (
                  <input
                    id="rider-identifier"
                    name="matricNumber"
                    value={matricNumber}
                    onChange={(event) => { setMatricNumber(filterMatricNumber(event.target.value)); setIdentifierError('') }}
                    onKeyDown={blockInvalidKeys(MATRIC_KEY_PATTERN)}
                    placeholder="e.g. 2020/12345"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    inputMode="text"
                    maxLength={20}
                    pattern={MATRIC_PATTERN}
                    title="Use a matric number with letters, numbers, / or - (5–20 characters)."
                    aria-invalid={Boolean(identifierError)}
                    aria-describedby={identifierError ? 'rider-identifier-hint rider-identifier-error' : 'rider-identifier-hint'}
                    required
                  />
                ) : (
                  <input
                    id="rider-identifier"
                    name="vehicleNumber"
                    value={vehicleNumber}
                    onChange={(event) => { setVehicleNumber(filterVehicleNumber(event.target.value)); setIdentifierError('') }}
                    onBlur={(event) => setVehicleNumber(event.target.value.trim())}
                    onKeyDown={blockInvalidKeys(VEHICLE_KEY_PATTERN)}
                    placeholder="e.g. LSD-123-AB"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    inputMode="text"
                    maxLength={12}
                    pattern={VEHICLE_PATTERN}
                    title="Use a vehicle number with letters, numbers, spaces or hyphens (5–12 characters)."
                    aria-invalid={Boolean(identifierError)}
                    aria-describedby={identifierError ? 'rider-identifier-hint rider-identifier-error' : 'rider-identifier-hint'}
                    required
                  />
                )}
              </span>
              <small className="partner-field-hint" id="rider-identifier-hint">
                {riderKind === 'student'
                  ? 'Matric style: letters, numbers, / or -, 5–20 characters.'
                  : 'Plate style: letters, numbers, spaces or hyphens, 5–12 characters.'}
              </small>
              {identifierError && <small className="partner-field-error" id="rider-identifier-error" role="alert">{identifierError}</small>}
            </div>
          )}
          <label>{content.extraLabel}<span className="partner-input-wrap">{type === 'vendor' ? <Store size={16} /> : <MapPin size={16} />}<input name={content.extraName} required placeholder={type === 'vendor' ? 'e.g. ChowZilla Kitchen' : 'e.g. Yaba, Lagos'} /></span></label>
          <label>Your name<span className="partner-input-wrap"><UserRound size={16} /><input name="name" autoComplete="name" required placeholder="Full name" /></span></label>
          <div className="partner-form-row">
            <label>Email address<span className="partner-input-wrap"><Mail size={16} /><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></span></label>
            <label>Phone number<span className="partner-input-wrap"><Phone size={16} /><input name="phone" type="tel" autoComplete="tel" required placeholder="080 0000 0000" /></span></label>
          </div>
          <label className="partner-consent">
            <input type="checkbox" name="consent" required />
            <span>I agree to be contacted about joining ChowZilla.</span>
          </label>
          <button className="partner-primary-button" type="submit">Register interest</button>
          <p className="partner-form-note" role="status" aria-live="polite">
            {submitted && type === 'rider'
              ? `Your ${submittedRiderKind === 'student' ? 'matric number' : 'vehicle number'} is included in the form preview. Nothing is sent to a server yet.`
              : submitted
                ? 'This preview does not send or store your details yet.'
                : 'Interest registration is a preview and is not connected yet.'}
          </p>
          <p className="partner-form-contact">
            Prefer email? <a href={`mailto:${CONTACT_EMAIL}?subject=ChowZilla%20partner%20enquiry`}>{CONTACT_EMAIL}</a>
          </p>
        </form>
      </section>

      </main>
      <Footer />
    </div>
  )
}

export default PartnerLandingPage
