export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'DMS API',
    version: '1.0.0',
    description: 'Document Management System API documentation'
  },
  servers: [
    {
      url: '/api/v2',
      description: 'V2 API'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          data: { type: 'object' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                errorCode: { type: 'number' }
              }
            }
          }
        }
      },
      UserObject: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          phoneCode: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['user', 'admin'] }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication APIs' },
    { name: 'Email Verification', description: 'Email OTP verification APIs' }
  ],
  paths: {
    '/user/sign-up': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', minLength: 8, example: 'Test@1234' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  phone: { type: 'string', example: '9876543210' },
                  phoneCode: { type: 'string', example: '+91' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/UserObject' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation error or email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  emailExists: {
                    summary: 'Email already registered',
                    value: {
                      data: {},
                      errors: [{ name: 'EmailAlreadyExistsErrorType', description: 'EMAIL_ALREADY_EXISTS' }]
                    }
                  },
                  validationError: {
                    summary: 'Validation failed',
                    value: {
                      data: {},
                      errors: [{ name: 'RequestInputValidationError', description: 'PLEASE_CHECK_REQUEST_DATA', fields: { body: ['data/email must match format "email"'] } }]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    '/user/sign-in': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', example: 'Test@1234' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/UserObject' },
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid credentials or user not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  userNotFound: {
                    summary: 'User not found',
                    value: { data: {}, errors: [{ name: 'UserNotFoundErrorType', description: 'User not found' }] }
                  },
                  invalidPassword: {
                    summary: 'Wrong password',
                    value: { data: {}, errors: [{ name: 'InvalidPasswordErrorType', description: 'INVALID_PASSWORD' }] }
                  }
                }
              }
            }
          }
        }
      }
    },

    '/user/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Send password reset link to email',
        description: 'Generates a JWT reset token (expires in 30 min) and sends a reset link via email. In development mode, the token is also returned in the response.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Reset link sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Password reset link sent to your email' },
                        resetToken: { type: 'string', description: 'Only present in development mode', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { data: {}, errors: [{ name: 'UserNotFoundErrorType', description: 'User not found' }] }
              }
            }
          }
        }
      }
    },

    '/user/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password using the token from forgot-password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  password: { type: 'string', minLength: 8, example: 'NewPass@5678' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Password reset successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Password reset successfully' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid or expired token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { data: {}, errors: [{ name: 'InvalidTokenErrorType', description: 'INVALID_TOKEN' }] }
              }
            }
          }
        }
      }
    },

    '/user/send-email-otp': {
      post: {
        tags: ['Email Verification'],
        summary: 'Send a 6-digit OTP to the user\'s email for verification',
        description: 'Generates a 6-digit OTP, stores it in Redis for 10 minutes, and sends it via email.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'OTP sent to your email' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'User not found or email already verified',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  userNotFound: {
                    summary: 'User not found',
                    value: { data: {}, errors: [{ name: 'UserNotFoundErrorType', description: 'User not found' }] }
                  },
                  alreadyVerified: {
                    summary: 'Already verified',
                    value: { data: {}, errors: [{ name: 'EmailAlreadyVerifiedErrorType', description: 'Email is already verified' }] }
                  }
                }
              }
            }
          }
        }
      }
    },

    '/user/verify-email-otp': {
      post: {
        tags: ['Email Verification'],
        summary: 'Verify email using the OTP received',
        description: 'Validates the OTP against Redis. On success, sets email_verified = true and deletes the OTP.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'otp'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  otp: { type: 'string', minLength: 6, maxLength: 6, example: '481203' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Email verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Email verified successfully' }
                      }
                    },
                    errors: { type: 'array', items: {}, example: [] }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid OTP or expired',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidOtp: {
                    summary: 'Wrong OTP',
                    value: { data: {}, errors: [{ name: 'InvalidTokenErrorType', description: 'Invalid OTP' }] }
                  },
                  expiredOtp: {
                    summary: 'OTP expired',
                    value: { data: {}, errors: [{ name: 'InvalidTokenErrorType', description: 'OTP expired or not found' }] }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
