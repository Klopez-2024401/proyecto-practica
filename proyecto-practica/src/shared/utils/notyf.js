import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const notyf = new Notyf({
  duration: 2500,
  position: { x: 'right', y: 'top' },
  dismissible: true,
})

export const notyfSuccess = (message, options = {}) =>
  notyf.success({ message, ...options })

export const notyfError = (message, options = {}) =>
  notyf.error({ message, ...options })

export default notyf
