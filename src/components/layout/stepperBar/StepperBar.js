import { FaCheck } from 'react-icons/fa'

const STEPS = [
  { id: 1, title: 'DOCX yuklash', subtitle: 'Fayl tanlandi' },
  { id: 2, title: 'Ajratish qoidasi', subtitle: 'Sozlamalarni kiriting' },
  { id: 3, title: 'Preview', subtitle: 'Natijani tekshiring' },
  { id: 4, title: 'Saqlash', subtitle: 'Faylni saqlang' },
]

const StepperBar = ({ currentStep }) => {
  return (
    <div className="stepperBar">
      {STEPS.map((step, index) => {
        const isDone = step.id < currentStep
        const isActive = step.id === currentStep
        return (
          <div className="stepperItem" key={step.id}>
            <div
              className={`stepperCircle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              {isDone ? <FaCheck /> : step.id}
            </div>
            <div className="stepperText">
              <p className="stepperTitle">{step.title}</p>
              <p className="stepperSubtitle">{step.subtitle}</p>
            </div>
            {index < STEPS.length - 1 && (
              <span className="stepperArrow">›</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepperBar
