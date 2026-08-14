import { FaCheck } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const StepperBar = ({ currentStep }) => {
  const { t } = useTranslation()
  const STEPS = [
    { id: 1, title: t('informationAllocation.stepper.step1.title'), subtitle: t('informationAllocation.stepper.step1.subtitle') },
    { id: 2, title: t('informationAllocation.stepper.step2.title'), subtitle: t('informationAllocation.stepper.step2.subtitle') },
    { id: 3, title: t('informationAllocation.stepper.step3.title'), subtitle: t('informationAllocation.stepper.step3.subtitle') },
    { id: 4, title: t('informationAllocation.stepper.step4.title'), subtitle: t('informationAllocation.stepper.step4.subtitle') },
  ]
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
