import icon from './assets/icon.jpeg'
import { useEffect, useRef, useState } from 'react'
import './App.css'

const tracks = [
  'AI Automation',
  'Product Management',
  'Product Design',
  'Frontend Development',
  'Backend Development',
  'Software Testing',
]

const states = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
  'Federal Capital Territory',
]

const questions = [
  [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'WhatsApp Phone Number', type: 'tel' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
    { name: 'age', label: 'Age Range', type: 'select', options: ['Under 18', '18–25', '26–40'] },
    { name: 'state', label: 'State of Residence', type: 'select', options: states },
    { name: 'status', label: 'Current Status', type: 'select', options: ['Undergraduate', 'Recent Graduate', 'NYSC Corps Member', 'Other'] },
    { name: 'institution', label: 'Institution', type: 'text' },
    { name: 'department', label: 'Department / Course of Study', type: 'text' },
  ],
  [
    { name: 'track', label: 'Which track would you like to join?', type: 'select', options: tracks },
    { name: 'reason', label: 'Why do you want to join this track?', type: 'textarea' },
    { name: 'experience', label: 'Do you have prior experience in your chosen track?', type: 'select', options: ['None', 'Beginner', 'Intermediate'] },
    { name: 'goals', label: 'What do you hope to achieve after the program?', type: 'textarea' },
  ],
  [
    { name: 'problem', label: 'What is one problem you would love to solve using technology?', type: 'textarea' },
    { name: 'attempt', label: 'Have you attempted building a solution? If yes, tell us about it.', type: 'textarea' },
    { name: 'barrier', label: 'What is holding you back from solving this problem?', type: 'textarea' },
    { name: 'resources', label: 'What resources, skills, tools or support do you need?', type: 'textarea' },
  ],
  [
    { name: 'hours', label: 'How many hours per week can you commit?', type: 'select', options: ['1–3 hours', '4–6 hours', '7–10 hours', 'More than 10 hours'] },
    { name: 'computer', label: 'Do you have access to a laptop or computer?', type: 'select', options: ['Yes', 'No', 'I have access to one'] },
    { name: 'internet', label: 'How reliable is your internet connection?', type: 'select', options: ['Very reliable', 'Fairly reliable', 'Unreliable'] },
    { name: 'sessions', label: 'Can you attend live sessions and meet weekly deadlines?', type: 'select', options: ['Yes', 'No', 'Not sure'] },
    { name: 'demo', label: 'Would you be available for a physical demo?', type: 'select', options: ['Yes', 'No', 'Depending on the location'] },
  ],
]

const titles = [
  'Personal Information',
  'Your Learning Track',
  'Ideas & Problem Solving',
  'Availability & Commitment',
]

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwZJJsIptjrQCP1PK-BleTrhKPZ2BEpMhSrWyWWSfUCTUbRBQDSPiSwIIXHcLQuhYhG9g/exec'
const DRAFT_KEY = 'armorh-tech-registration-draft'

const loadDraft = () => {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
  } catch {
    return {}
  }
}

function CustomSelect({ id, options, value, onChange, invalid }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.indexOf(value)))
  const selectRef = useRef(null)
  const selectedIndex = options.indexOf(value)

  useEffect(() => {
    if (!open) return undefined
    const closeOnOutsideClick = (event) => {
      if (!selectRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
        setOpen(true)
      } else {
        setActiveIndex(index => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) {
        onChange(options[activeIndex])
        setOpen(false)
      } else {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
        setOpen(true)
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={selectRef} className="custom-select">
      <button
        id={id}
        type="button"
        className={`form-field custom-select-trigger ${invalid ? 'form-field-invalid' : ''} ${open ? 'is-open' : ''}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        aria-invalid={invalid}
        onClick={() => {
          setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
          setOpen(current => !current)
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? '' : 'custom-select-placeholder'}>{value || 'Select an option'}</span>
        <span className="custom-select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div id={`${id}-options`} role="listbox" aria-labelledby={id} className="custom-select-menu">
          {options.map((option, index) => (
            <div
              id={`${id}-option-${index}`}
              key={option}
              role="option"
              aria-selected={option === value}
              className={`custom-select-option ${index === activeIndex ? 'is-active' : ''} ${option === value ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function App() {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(() => Math.min(Number(loadDraft().step) || 0, questions.length - 1))
  const [form, setForm] = useState(() => loadDraft().form || {})
  const [invalidFields, setInvalidFields] = useState([])
  const [toast, setToast] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    if (!submitted) localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step }))
  }, [form, step, submitted])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const update = (name, value) => {
    setForm(current => ({ ...current, [name]: value }))
    setInvalidFields(current => current.filter(field => field !== name))
  }

  const next = () => {
    const unanswered = questions[step].filter(q => !form[q.name]?.trim())
    if (unanswered.length) {
      setInvalidFields(unanswered.map(q => q.name))
      setToast(`Please complete the highlighted ${unanswered.length === 1 ? 'field' : 'fields'} before continuing.`)
      return
    }
    setStep(step + 1)
  }

  const previous = () => setStep(step - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const unanswered = questions[step].filter(q => !form[q.name]?.trim())
    if (unanswered.length) {
      setInvalidFields(unanswered.map(q => q.name))
      setToast(`Please complete the highlighted ${unanswered.length === 1 ? 'field' : 'fields'} before submitting.`)
      return
    }
    setSubmitting(true)
    setSubmitError(false)
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(form),
      })
      localStorage.removeItem(DRAFT_KEY)
      setSubmitted(true)
      window.scrollTo(0, 0)
    } catch {
      setSubmitError(true)
    }
    setSubmitting(false)
  }

  const progress = ((step + 1) / questions.length) * 100

  // ---------- WELCOME PAGE ----------
  if (!started) {
    return (
      <main className="welcome-shell">
        <section className="welcome-card">
          <div className="welcome-content">
            <div className="brand-lockup">
              <img src={icon} alt="Armorh Tech" className="brand-icon" />
              <p className="brand-name">
                Armorh <span>Tech</span>
              </p>
            </div>

            <p className="welcome-label">EQUIPPED TO BUILD</p>

            <h1>
              Join the Armorh Tech
              <span> Learning Community.</span>
            </h1>

            <p className="welcome-description">
             Learn. Build skills. Solve real problems. Be part of a growing
              community of technology innovators.
            </p>

            <div className="welcome-line"></div>

            <div className="welcome-highlights">
              <div>
                <span>01</span>
                <p>Hands-on Learning</p>
              </div>
              <div>
                <span>02</span>
                <p>Expert Mentorship</p>
              </div>
              <div>
                <span>03</span>
                <p>Real-World Projects</p>
              </div>
            </div>

            <div className="welcome-info">
              <h3>Application Overview</h3>
              <p>
                Tell us about yourself, your interests, and what you hope
                to achieve through the Armorh Tech program.
              </p>
              <p className="duration">This application takes about 5 minutes.</p>
            </div>

            <button
              className="start-button"
              onClick={() => setStarted(true)}
            >
              Start Application <span>→</span>
            </button>

            <p className="welcome-footer">
              Together, we build a smarter, more innovative future.
            </p>
          </div>
        </section>
      </main>
    )
  }

  // ---------- THANK-YOU PAGE ----------
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F7F6] px-4 py-8">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white text-center shadow-xl shadow-slate-900/10">
          <div className="bg-gradient-to-r from-[#102B46] via-[#0F5B62] to-[#0F766E] px-6 py-10 text-white">
            <div className="success-check mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F28C5B] text-4xl font-bold">
              ✓
            </div>
            <h2 className="fade-up mt-6 text-2xl font-extrabold">
              Application Submitted!
            </h2>
          </div>

          <div className="fade-up px-6 py-8 md:px-10">
            <p className="text-lg font-semibold text-[#102B46]">
              Thank you, {form.fullName?.split(' ')[0]}.
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              We have received your application to the Armorh Tech program.
              Our team will review it and reach out to you at{' '}
              <strong className="text-[#102B46]">{form.email}</strong> with
              the next steps.
            </p>

            <div className="mt-6 rounded-2xl bg-[#F5F7F6] p-5 text-left text-sm text-gray-600">
              <p className="mb-2 font-semibold text-[#102B46]">What happens next</p>
              <p>1. Keep an eye on your inbox, and check your spam folder too.</p>
              <p>2. Our team reviews every application carefully.</p>
              <p>3. Selected applicants will be contacted by email.</p>
            </div>

            <p className="mt-8 text-xs text-gray-500">
              Equipped to Build · Armorh Tech
            </p>
          </div>
        </div>
      </main>
    )
  }

  // ---------- FORM PAGE ----------
  return (
    <main className="min-h-screen bg-[#F5F7F6] px-4 py-4 md:py-8">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10">
          <div className="bg-gradient-to-r from-[#102B46] via-[#0F5B62] to-[#0F766E] px-6 py-8 text-white md:px-10">
            <div className="brand-lockup">
              <img src={icon} alt="Armorh Tech" className="brand-icon" />
              <p className="brand-name">
                Armorh <span>Tech</span>
              </p>
            </div>
            <p className="text-sm font-medium text-orange-200">
              PARTICIPANT APPLICATION · 2026
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Let's get to know you
            </h2>
            <p className="mt-2 text-sm text-teal-50">
              Complete the application to begin your journey with us.
            </p>
          </div>

          <div className="px-6 pt-7 md:px-10">
            <div className="mb-3 flex justify-between text-sm">
              <span className="font-semibold text-[#102B46]">
                Step {step + 1} of {questions.length}
              </span>
              <span className="text-gray-500">{Math.round(progress)}% completed</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#F28C5B] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 md:px-10">
            <h3 className="mb-1 text-xl font-bold text-[#102B46]">
              {titles[step]}
            </h3>
            <p className="mb-7 text-sm text-gray-500">
              Please provide accurate information in each field.
            </p>

            <div className="space-y-6">
              {questions[step].map((q) => (
                <div key={q.name}>
                  <label htmlFor={q.name} className="mb-2 block text-sm font-semibold text-gray-700">
                    {q.label} <span className="text-[#F28C5B]">*</span>
                  </label>

                  {q.type === 'textarea' ? (
                    <textarea
                      required
                      id={q.name}
                      rows={4}
                      value={form[q.name] || ''}
                      aria-invalid={invalidFields.includes(q.name)}
                      onChange={e => update(q.name, e.target.value)}
                      placeholder="Type your answer here..."
                      className={`form-field ${invalidFields.includes(q.name) ? 'form-field-invalid' : ''}`}
                    />
                  ) : q.type === 'select' ? (
                    <CustomSelect
                      id={q.name}
                      options={q.options}
                      value={form[q.name] || ''}
                      invalid={invalidFields.includes(q.name)}
                      onChange={value => update(q.name, value)}
                    />
                  ) : (
                    <input
                      required
                      id={q.name}
                      type={q.type}
                      value={form[q.name] || ''}
                      aria-invalid={invalidFields.includes(q.name)}
                      onChange={e => update(q.name, e.target.value)}
                      placeholder="Enter your answer"
                      className={`form-field ${invalidFields.includes(q.name) ? 'form-field-invalid' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {submitError && (
              <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                Something went wrong. Please check your internet and try again.
              </p>
            )}

            {toast && <div className="form-toast" role="alert">{toast}</div>}

            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={previous}
                disabled={step === 0}
                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 disabled:invisible"
              >
                Previous
              </button>

              {step < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-xl bg-[#F28C5B] px-8 py-3 text-sm font-semibold text-[#102B46] transition hover:bg-[#E87543]"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#F28C5B] px-8 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 Armorh Tech · Equipped to Build.
        </p>
      </div>
    </main>
  )
}

export default App
