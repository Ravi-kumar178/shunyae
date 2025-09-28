const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student-Teacher Connect API',
      version: '1.0.0',
      description: 'A simple API where teachers can post assignments and students can view them',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password',
            },
            role: {
              type: 'string',
              enum: ['teacher', 'student'],
              description: 'User role',
            },
          },
        },
        Assignment: {
          type: 'object',
          required: ['title', 'description', 'subject', 'deadline'],
          properties: {
            title: {
              type: 'string',
              description: 'Assignment title',
            },
            description: {
              type: 'string',
              description: 'Assignment description',
            },
            subject: {
              type: 'string',
              description: 'Subject of the assignment',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Assignment deadline',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
}

const specs = swaggerJsdoc(options)

module.exports = specs
