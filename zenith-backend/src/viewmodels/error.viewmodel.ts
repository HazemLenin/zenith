export class ErrorViewModel {
  constructor(public message: string, public code: string) {}

  static unauthorized(
    message: string = "Authentication failed"
  ): ErrorViewModel {
    return new ErrorViewModel(message, "UNAUTHORIZED");
  }

  static forbidden(
    message: string = "Insufficient permissions"
  ): ErrorViewModel {
    return new ErrorViewModel(message, "FORBIDDEN");
  }

  static notFound(message: string = "Resource not found"): ErrorViewModel {
    return new ErrorViewModel(message, "NOT_FOUND");
  }

  static validationError(
    message: string = "Invalid request data"
  ): ErrorViewModel {
    return new ErrorViewModel(message, "VALIDATION_ERROR");
  }

  static internalError(message: string = "Server error"): ErrorViewModel {
    return new ErrorViewModel(message, "INTERNAL_ERROR");
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
      },
    };
  }
}
