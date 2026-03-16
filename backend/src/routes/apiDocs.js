const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../openapi.json');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Custom middleware to serve Swagger UI static assets properly in Vercel
const swaggerUiAssetsMiddleware = (req, res, next) => {
  if (req.url.includes('swagger-ui')) {
    // Extract the asset path
    const assetPath = req.url.replace('/api-docs', '').replace('//', '/');
    
    // Determine the full path to the swagger-ui-dist assets
    const swaggerDistPath = path.dirname(require.resolve('swagger-ui-dist'));
    const fullPath = path.join(swaggerDistPath, assetPath);
    
    // Check if file exists and determine content type
    if (fs.existsSync(fullPath)) {
      if (assetPath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (assetPath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (assetPath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (assetPath.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      } else if (assetPath.endsWith('.map')) {
        res.setHeader('Content-Type', 'application/json');
      }
      
      // Send the file content
      const content = fs.readFileSync(fullPath);
      return res.send(content);
    }
  }
  next();
};

// Apply the custom middleware for static assets
router.use(swaggerUiAssetsMiddleware);

// Serve Swagger UI at /api/docs
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: `
    .topbar { display: none; }
    .info { margin: 20px 0; }
  `,
}));

// Serve raw OpenAPI JSON at /api/spec
router.get('/spec', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

module.exports = router;