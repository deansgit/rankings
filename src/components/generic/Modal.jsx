import React, { useEffect, useRef } from 'react'
import { bool, func, node, number, string } from 'prop-types'

import ReactDOM from 'react-dom'
import useOnClickOutside from '../../hooks/use-onclick-outside'

/* 
  Base Modal component
*/
function Modal({ children, ariaLabel, width, open, setOpen }) {
  const ref = useRef()
  useOnClickOutside(ref, () => setOpen(false))
  const closeModal = () => setOpen(false)

  const onKeyPress = e => {
    if (e.keyCode === 27 && open) closeModal()
  }

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => (document.body.style = '')
  }, [open])

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress)
    return () => {
      document.removeEventListener('keydown', onKeyPress)
    }
  })

  if (open) {
    return (
      <Portal
        ariaLabel={ariaLabel}
        open={open}
        ref={ref}
        setOpen={setOpen}
        width={width}
        content={children}
      />
    )
  }

  return null
}

Modal.propTypes = {
  children: node,
  ariaLabel: string,
  width: number,
  open: bool,
  setOpen: func
}

const Portal = React.forwardRef(
  ({ content, ariaLabel, width, setOpen }, ref) => {
    return ReactDOM.createPortal(
      <aside className="modal" aria-label={ariaLabel}>
        <div
          className="modal__content"
          style={{ width: width ? `${width}px` : '800px' }}
          ref={ref}
        >
          <button
            onClick={() => setOpen(false)}
            className="modal__close-button"
          >
            <svg
              width="20px"
              height="20px"
              version="1.1"
              viewBox="0 0 20 20"
              x="0px"
              y="0px"
            >
              <path d="M11.414 10l5.293-5.293a.999.999 0 1 0-1.414-1.414L10 8.586 4.707 3.293a.999.999 0 1 0-1.414 1.414L8.586 10l-5.293 5.293a.999.999 0 1 0 1.414 1.414L10 11.414l5.293 5.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z" />
            </svg>
          </button>
          {content}
        </div>
      </aside>,
      document.body
    )
  }
)

Portal.propTypes = {
  content: node.isRequired,
  ariaLabel: string.isRequired,
  width: number,
  setOpen: func.isRequired
}

export default Modal
