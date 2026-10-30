import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, Pause, Play, Utensils, UserRound } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import ThemeToggle from '../../Components/ThemeToggle'
import SkipLink from '../../Components/SkipLink'
import usePageMeta from '../../hooks/usePageMeta'
import { CONTACT_EMAIL } from '../../config'

type AuthMode = 'signin' | 'signup'

const cookingVideo = '/auth-cooking.mp4'

type RecoveryStep = 'email' | 'code' | 'password' | 'done'

const PasswordRecovery = ({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) => {
  const [step, setStep] = useState<RecoveryStep>('email')
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')
    setStep('code')
  }

  const handleCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')
    setStep('password')
  }

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setFeedback('Those passwords don’t match yet.')
      return
    }
    setFeedback('This preview is ready to connect to password recovery.')
    setStep('done')
  }

  return (
    <div className="auth-form-wrap recovery-wrap">
      <button className="auth-back-link recovery-back" type="button" onClick={onBack}>Back to sign in</button>
      {step === 'email' && (
        <>
          <div className="auth-form-kicker">ACCOUNT RECOVERY</div>
          <h2 id="auth-heading">Reset your password</h2>
          <p className="auth-subtitle">Enter the email address linked to your ChowZilla account.</p>
          <form className="auth-form recovery-form" onSubmit={handleEmailSubmit}>
            <label className="auth-field">
              <span>Email address</span>
              <span className="auth-input-shell">
                <Mail size={17} aria-hidden="true" />
                <input autoComplete="email" autoFocus name="recovery-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </span>
            </label>
            <button className="auth-submit" type="submit">Continue</button>
          </form>
        </>
      )}
      {step === 'code' && (
        <>
          <div className="auth-form-kicker">CHECK YOUR EMAIL</div>
          <h2 id="auth-heading">Enter your code</h2>
          <p className="auth-subtitle">Enter the 6-digit code we’ll send to <strong className="recovery-email-address">{email}</strong>.</p>
          <form className="auth-form recovery-form" onSubmit={handleCodeSubmit}>
            <label className="auth-field">
              <span>Verification code</span>
              <input className="verification-code-input" autoComplete="one-time-code" autoFocus inputMode="numeric" name="verification-code" pattern="[0-9]{6}" placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
            </label>
            <p className="recovery-note">Email delivery and code verification will be connected when the backend is ready.</p>
            <button className="auth-submit" type="submit">Verify code</button>
          </form>
          <button className="resend-code" type="button" onClick={() => setFeedback('Code delivery will be available when password recovery is connected.')}>Resend code</button>
          <p className="auth-feedback" role="status" aria-live="polite">{feedback}</p>
        </>
      )}
      {step === 'password' && (
        <>
          <div className="auth-form-kicker">ONE LAST STEP</div>
          <h2 id="auth-heading">Choose a new password</h2>
          <p className="auth-subtitle">Create a new password for {email}.</p>
          <form className="auth-form recovery-form" onSubmit={handlePasswordSubmit}>
            <label className="auth-field">
              <span>New password</span>
              <span className="auth-input-shell">
                <LockKeyhole size={17} aria-hidden="true" />
                <input autoComplete="new-password" autoFocus name="new-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
              </span>
              <small className="field-hint">Use at least 8 characters.</small>
            </label>
            <label className="auth-field">
              <span>Confirm new password</span>
              <span className="auth-input-shell">
                <LockKeyhole size={17} aria-hidden="true" />
                <input autoComplete="new-password" name="confirm-password" type="password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} aria-invalid={feedback === 'Those passwords don’t match yet.'} aria-describedby="password-feedback" required />
              </span>
            </label>
            <button className="auth-submit" type="submit">Update password</button>
          </form>
          <p className="auth-feedback" id="password-feedback" role="status" aria-live="polite">{feedback}</p>
        </>
      )}
      {step === 'done' && (
        <div className="recovery-done">
          <span className="recovery-done-check">✓</span>
          <div className="auth-form-kicker">ALL SET</div>
          <h2 id="auth-heading">Reset flow ready</h2>
          <p className="auth-subtitle">Once account services are connected, your verified code will let you save this new password.</p>
          <button className="auth-submit" type="button" onClick={onBack}>Return to sign in</button>
        </div>
      )}
    </div>
  )
}

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [showVideo, setShowVideo] = useState(() => window.matchMedia('(min-width: 761px)').matches)
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [email, setEmail] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const mode: AuthMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  usePageMeta(
    recoveryOpen
      ? 'Reset your password — ChowZilla'
      : mode === 'signup' ? 'Create your account — ChowZilla' : 'Sign in — ChowZilla',
    mode === 'signup'
      ? 'Create your ChowZilla account to make ordering your favourite meals easier.'
      : 'Sign in to your ChowZilla account and pick up where your cravings left off.',
  )

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches)
    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const viewportPreference = window.matchMedia('(min-width: 761px)')
    const updateVideoPreference = () => setShowVideo(viewportPreference.matches)
    updateVideoPreference()
    viewportPreference.addEventListener('change', updateVideoPreference)
    return () => viewportPreference.removeEventListener('change', updateVideoPreference)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (showVideo && !reducedMotion) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [showVideo, reducedMotion])

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }

  const changeMode = (nextMode: AuthMode) => {
    setFeedback('')
    setRecoveryOpen(false)
    setPasswordVisible(false)
    setSearchParams({ mode: nextMode })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(mode === 'signup'
      ? 'Account creation will be available soon.'
      : 'Sign in will be available soon.')
  }

  return (
    <>
      <SkipLink />
      <main className="auth-page" id="main-content" tabIndex={-1}>
      <section className="auth-visual" aria-label="ChowZilla food inspiration">
        <video
          ref={videoRef}
          className="auth-video"
          autoPlay={showVideo && !reducedMotion}
          muted
          loop
          playsInline
          preload={showVideo ? 'metadata' : 'none'}
          poster="/images/auth-poster.jpg"
          aria-hidden="true"
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
        >
          <source src={cookingVideo} type="video/mp4" />
        </video>
        <div className="auth-video-shade" />
        {showVideo && !reducedMotion && (
          <button
            className="auth-video-toggle"
            type="button"
            onClick={toggleVideo}
            aria-label={videoPlaying ? 'Pause background video' : 'Play background video'}
          >
            {videoPlaying ? <Pause size={17} /> : <Play size={17} />}
          </button>
        )}
        <Link className="auth-brand" to="/" aria-label="ChowZilla home">
          <span className="auth-brand-mark"><Utensils size={20} strokeWidth={2.5} /></span>
          <span>Chow<span>Zilla</span></span>
        </Link>
        <div className="auth-visual-copy">
          <span className="auth-eyebrow">A GOOD MEAL CHANGES THE DAY</span>
          <h1>Come hungry.<br />Leave happy.</h1>
          <p>Find the food you’re in the mood for, from kitchens around you.</p>
          <div className="auth-visual-caption"><span /> Made for good food days</div>
        </div>
      </section>

      <section className="auth-form-panel" aria-labelledby="auth-heading">
        <ThemeToggle className="theme-toggle auth-theme-toggle" />
        {!recoveryOpen && <Link className="auth-back-link" to="/">Back to ChowZilla</Link>}
        {recoveryOpen ? (
          <PasswordRecovery initialEmail={email} onBack={() => { setRecoveryOpen(false); setFeedback('') }} />
        ) : <div className={`auth-form-wrap auth-mode-${mode}`} key={mode}>
          <div className="auth-form-kicker">YOUR NEXT FAVOURITE IS WAITING</div>
          <h2 id="auth-heading">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
          <p className="auth-subtitle">
            {mode === 'signup'
              ? 'Sign up to make your next meal a little easier.'
              : 'Sign in to pick up where your cravings left off.'}
          </p>

          <div className="auth-mode-switch" role="group" aria-label="Choose sign in or sign up">
            <button type="button" aria-pressed={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => changeMode('signin')}>Sign in</button>
            <button type="button" aria-pressed={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => changeMode('signup')}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="auth-field">
                <span>Full name</span>
                <span className="auth-input-shell">
                  <UserRound size={17} aria-hidden="true" />
                  <input autoComplete="name" name="name" placeholder="Your name" required />
                </span>
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <span className="auth-input-shell">
                <Mail size={17} aria-hidden="true" />
                <input autoComplete="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </span>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <span className="password-input-wrap">
                <LockKeyhole size={17} aria-hidden="true" />
                <input autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} name="password" type={passwordVisible ? 'text' : 'password'} placeholder="Enter your password" minLength={mode === 'signup' ? 8 : undefined} required />
                <button type="button" className="password-toggle" aria-label={passwordVisible ? 'Hide password' : 'Show password'} onClick={() => setPasswordVisible((visible) => !visible)}>
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {mode === 'signup' && <small className="field-hint">Use at least 8 characters.</small>}
            </label>
            {mode === 'signin' && <button type="button" className="forgot-password" onClick={() => { setFeedback(''); setRecoveryOpen(true) }}>Forgot password?</button>}
            <button className="auth-submit" type="submit">
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <p className="auth-feedback" role="status" aria-live="polite">{feedback}</p>

          <div className="auth-divider"><span>or continue with</span></div>
          <button className="auth-google-button" type="button" onClick={() => setFeedback('Google sign-in is coming soon.')}>
            <svg aria-hidden="true" viewBox="0 0 48 48" width="19" height="19">
              <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z" />
              <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.9 1.3-4.2 2.1-6.8 2.1-5.2 0-9.6-3.5-11.2-8.2H5.9v5.2A20 20 0 0 0 24 44Z" />
              <path fill="#FBBC05" d="M12.8 27.9a12 12 0 0 1 0-7.8v-5.2H5.9a20 20 0 0 0 0 18.2l6.9-5.2Z" />
              <path fill="#EA4335" d="M24 11.9c3 0 5.6 1 7.7 3.1l5.8-5.8C34 5.9 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.2c1.6-4.7 6-8.2 11.2-8.2Z" />
            </svg>
            Continue with Google
          </button>

          <p className="auth-switch-copy">
            {mode === 'signup' ? 'Already have an account?' : 'New to ChowZilla?'}{' '}
            <button type="button" onClick={() => changeMode(mode === 'signup' ? 'signin' : 'signup')}>
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>}
        <p className="auth-legal-note">By continuing, you agree to use ChowZilla responsibly. <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>.</p>
      </section>
      </main>
    </>
  )
}

export default AuthPage
