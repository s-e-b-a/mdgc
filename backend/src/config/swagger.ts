import swaggerJsdoc from 'swagger-jsdoc';

/**
 * OpenAPI 3.0 specification for the Inventory API.
 * Documents all REST endpoints that replace the original SOAP web service.
 */
const swaggerDefinition: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory API',
      version: '1.0.0',
      description:
        'Inventory management REST API for video games, consoles, accessories, and platforms. ' +
        'Migrated from Java SOAP/JAX-WS web service to Node.js TypeScript with Express.',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    components: {
      schemas: {
        Platform: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Platform ID' },
            name: { type: 'string', description: 'Platform name' },
          },
          required: ['name'],
        },
        VideoGame: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Video game ID' },
            title: { type: 'string', description: 'Game title' },
            platformId: { type: 'integer', description: 'Platform ID' },
            platform: {
              type: 'string',
              nullable: true,
              description: 'Platform name',
            },
            format: {
              type: 'string',
              nullable: true,
              description: 'Physical or Digital',
            },
            completeness: {
              type: 'string',
              nullable: true,
              description: 'Completeness status',
            },
            region: {
              type: 'string',
              nullable: true,
              description: 'Game region',
            },
            storeOrigin: {
              type: 'string',
              nullable: true,
              description: 'Store of origin',
            },
            purchasePrice: {
              type: 'number',
              format: 'float',
              description: 'Purchase price',
            },
            acquisitionDate: {
              type: 'string',
              nullable: true,
              description: 'Acquisition date (YYYY-MM-DD)',
            },
            playState: {
              type: 'string',
              nullable: true,
              description: 'Current play state',
            },
          },
          required: ['title', 'platformId'],
        },
        Console: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Console ID' },
            platformId: {
              type: 'integer',
              nullable: true,
              description: 'Platform ID',
            },
            platformName: {
              type: 'string',
              nullable: true,
              description: 'Platform name',
            },
            model: { type: 'string', description: 'Console model' },
            serialNumber: {
              type: 'string',
              nullable: true,
              description: 'Serial number',
            },
            colorEdition: {
              type: 'string',
              nullable: true,
              description: 'Color/edition',
            },
            status: {
              type: 'string',
              nullable: true,
              description: 'Console status',
            },
            storageCapacity: {
              type: 'string',
              nullable: true,
              description: 'Storage capacity',
            },
            includedCables: {
              type: 'string',
              nullable: true,
              description: 'Included cables',
            },
          },
          required: ['model'],
        },
        Accessory: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Accessory ID' },
            type: { type: 'string', description: 'Accessory type' },
            brand: {
              type: 'string',
              nullable: true,
              description: 'Brand name',
            },
            connectivity: {
              type: 'string',
              nullable: true,
              description: 'Connectivity type',
            },
          },
          required: ['type'],
        },
        StatisticsReport: {
          type: 'object',
          properties: {
            totalVideoGames: {
              type: 'integer',
              description: 'Total number of video games',
            },
            totalConsoles: {
              type: 'integer',
              description: 'Total number of consoles',
            },
            totalAccessories: {
              type: 'integer',
              description: 'Total number of accessories',
            },
            totalCollectionValue: {
              type: 'number',
              format: 'float',
              description: 'Total collection value',
            },
            gamesByPlatform: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  count: { type: 'integer' },
                },
              },
            },
            gamesByPlayState: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  playState: { type: 'string' },
                  count: { type: 'integer' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error type' },
            message: { type: 'string', description: 'Error message' },
          },
        },
        CollectionValue: {
          type: 'object',
          properties: {
            value: {
              type: 'number',
              format: 'float',
              description: 'Total collection value',
            },
          },
        },
        PingResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Ping response message' },
          },
        },
      },
    },
    paths: {
      '/api/ping': {
        get: {
          tags: ['Health'],
          summary: 'Health check / Ping',
          description: 'Returns a pong message to verify the service is running.',
          responses: {
            '200': {
              description: 'Successful ping',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PingResponse' },
                },
              },
            },
          },
        },
      },
      '/api/platforms': {
        get: {
          tags: ['Platforms'],
          summary: 'Get all platforms',
          responses: {
            '200': {
              description: 'List of platforms',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Platform' },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Platforms'],
          summary: 'Add a new platform',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Platform' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Platform created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Platform' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/platforms/{id}': {
        put: {
          tags: ['Platforms'],
          summary: 'Update a platform',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Platform' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Platform updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Platform' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Platforms'],
          summary: 'Delete a platform',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '204': { description: 'Platform deleted' },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/videogames': {
        get: {
          tags: ['Video Games'],
          summary: 'Get all video games',
          responses: {
            '200': {
              description: 'List of video games',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/VideoGame' },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Video Games'],
          summary: 'Add a new video game',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VideoGame' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Video game created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/VideoGame' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/videogames/{id}': {
        put: {
          tags: ['Video Games'],
          summary: 'Update a video game',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VideoGame' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Video game updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/VideoGame' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Video Games'],
          summary: 'Delete a video game',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '204': { description: 'Video game deleted' },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/videogames/collection-value': {
        get: {
          tags: ['Video Games'],
          summary: 'Get total collection value',
          description: 'Returns the sum of all video game purchase prices.',
          responses: {
            '200': {
              description: 'Collection value',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CollectionValue' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/consoles': {
        get: {
          tags: ['Consoles'],
          summary: 'Get all consoles',
          responses: {
            '200': {
              description: 'List of consoles',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Console' },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Consoles'],
          summary: 'Add a new console',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Console' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Console created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Console' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/consoles/{id}': {
        put: {
          tags: ['Consoles'],
          summary: 'Update a console',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Console' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Console updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Console' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Consoles'],
          summary: 'Delete a console',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '204': { description: 'Console deleted' },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/accessories': {
        get: {
          tags: ['Accessories'],
          summary: 'Get all accessories',
          responses: {
            '200': {
              description: 'List of accessories',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Accessory' },
                  },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Accessories'],
          summary: 'Add a new accessory',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Accessory' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Accessory created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Accessory' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/accessories/{id}': {
        put: {
          tags: ['Accessories'],
          summary: 'Update an accessory',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Accessory' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Accessory updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Accessory' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Accessories'],
          summary: 'Delete an accessory',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '204': { description: 'Accessory deleted' },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/statistics': {
        get: {
          tags: ['Statistics'],
          summary: 'Get statistics report',
          description:
            'Returns a comprehensive statistics report including counts, collection value, and breakdowns by platform and play state.',
          responses: {
            '200': {
              description: 'Statistics report',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/StatisticsReport' },
                },
              },
            },
            '500': {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerDefinition);
