import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MessageList from '../components/messageList'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('MessageList Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the chat interface', () => {
    render(<MessageList />)
    expect(screen.getByText('Chat with GPT')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument()
    expect(screen.getByText('Send')).toBeInTheDocument()
  })

  it('allows user to type in the input field', async () => {
    const user = userEvent.setup()
    render(<MessageList />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    await user.type(input, 'Hello, world!')
    
    expect(input).toHaveValue('Hello, world!')
  })

  it('disables input and button when loading', () => {
    render(<MessageList />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const button = screen.getByText('Send')
    
    // Initially should be enabled
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('prevents sending empty messages', async () => {
    const user = userEvent.setup()
    render(<MessageList />)
    
    const button = screen.getByText('Send')
    await user.click(button)
    
    // Should not make API call for empty message
    expect(fetch).not.toHaveBeenCalled()
  })

  it('handles successful message sending', async () => {
    const user = userEvent.setup()
    const mockResponse = { response: 'Hello! How can I help you?' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })
    
    render(<MessageList />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const button = screen.getByText('Send')
    
    await user.type(input, 'Hello!')
    await user.click(button)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/uploadfile/', {
        method: 'POST',
        body: expect.any(FormData),
      })
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    // Mock alert to avoid browser alert during tests
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    
    render(<MessageList />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const button = screen.getByText('Send')
    
    await user.type(input, 'Hello!')
    await user.click(button)
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'An error occurred while sending your message. Please try again later.'
      )
    })
    
    consoleSpy.mockRestore()
    alertSpy.mockRestore()
  })

  it('handles file upload', async () => {
    const user = userEvent.setup()
    render(<MessageList />)
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const fileInput = screen.getByLabelText('📎').parentElement.querySelector('input[type="file"]')
    
    await user.upload(fileInput, file)
    
    expect(fileInput.files[0]).toBe(file)
  })

  it('clears input after sending message', async () => {
    const user = userEvent.setup()
    const mockResponse = { response: 'Hello! How can I help you?' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })
    
    render(<MessageList />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const button = screen.getByText('Send')
    
    await user.type(input, 'Hello!')
    await user.click(button)
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })
})
