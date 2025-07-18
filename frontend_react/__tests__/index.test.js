import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home Page', () => {
  it('renders the chat application', () => {
    render(<Home />)
    expect(screen.getByText('Chat with GPT')).toBeInTheDocument()
  })

  it('renders the message input field', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument()
  })

  it('renders the send button', () => {
    render(<Home />)
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('renders the file upload button', () => {
    render(<Home />)
    expect(screen.getByText('📎')).toBeInTheDocument()
  })

  it('renders the chat container', () => {
    render(<Home />)
    const chatContainer = screen.getByText('Chat with GPT').closest('div')
    expect(chatContainer).toBeInTheDocument()
  })
})
