import { Controller } from "@hotwired/stimulus"

export default class UserController extends Controller {
  static targets = [ "userModalItem", "userModal" ]

  connect() {
    this.listItemIndex = 0
    this.highlight()
    this.userModalKeydown = this.userModalKeydown.bind(this)
    window.addEventListener('userModalKeydown', this.userModalKeydown)
  }

  disconnect() {
    window.removeEventListener('userModalKeydown', this.userModalKeydown)
  }

  next() {
    this.listItemIndex++
    if (this.listItemIndex >= this.userModalItemTargets.length) {
      this.listItemIndex = 0
    }
    this.highlight()
  }

  previous() {
    this.listItemIndex--
    if (this.listItemIndex < 0) {
      this.listItemIndex = this.userModalItemTargets.length - 1
    }
    this.highlight()
  }

  highlight() {
    this.userModalItemTargets.forEach((element, idx) => {
      element.classList.toggle('bg-neutral-200', idx === this.listItemIndex)
      element.classList.toggle('dark:bg-neutral-700/50', idx === this.listItemIndex)
    })
  }

  openUserModal() {
    this.userModalTarget.classList.remove('hidden')
  }

  closeUserModal() {
    this.userModalTarget.classList.add('hidden')
  }

  toggleUserSettingsModal(event) {
    event.preventDefault()
    const rootController = this.application.controllers.find(c => c.identifier === "root")

    this.userSettingsModalTarget.classList.toggle('hidden')
    const modalState = rootController.userSettingsModalOpen
    rootController.setUserSettingsModalOpen(!modalState)
  }

  userModalKeydown(event) {
    const rootController = this.application.controllers.find(c => c.identifier === "root")

    if (event.keyCode === 85) {
      this.openUserModal()
      rootController.setUserModalOpen(true)
    }

    if (event.key === 'Escape') {
      this.closeUserModal()
      rootController.setUserModalOpen(false)
    }

    if (event.key === 'ArrowUp') {
      if (rootController.userModalOpen) {
        this.previous()
      }
    }

    if (event.key === 'ArrowDown') {
      if (rootController.userModalOpen) {
        this.next()
      }
    }
  }
}
