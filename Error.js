class CustomError extends Error {
  constructor(message, stack) {
    this.message = message
    this.stack = stack
  }
}

export default CustomError
