// Service Worker for FixMyPhone PWA
const CACHE_NAME = 'fixmyphone-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Critical resources to cache immediately
const CRITICAL_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Resources to cache on first visit
const EXTENDED_CACHE = [
  '/book-repair',
  '/services',
  '/reviews',
  '/contact',
  '/dashboard'
];

// API endpoints that should work offline (cached responses)
const API_CACHE = [
  '/api/services',
  '/api/pricing'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Caching critical resources');
        await cache.addAll(CRITICAL_CACHE);
        console.log('Service Worker: Critical resources cached');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('Service Worker: Install failed', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
        
        // Take control of all clients
        await self.clients.claim();
        console.log('Service Worker: Activated successfully');
      } catch (error) {
        console.error('Service Worker: Activation failed', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for specific APIs)
  if (url.origin !== location.origin && !isAllowedExternalRequest(url)) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isHTMLRequest(request)) {
    event.respondWith(handleHTMLRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Check if request is for HTML
function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Check if request is for static assets
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(url.pathname);
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || url.hostname.includes('supabase');
}

// Check if external request is allowed
function isAllowedExternalRequest(url) {
  const allowedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ];
  return allowedDomains.some(domain => url.hostname.includes(domain));
}

// Handle HTML requests - Network First with Offline Fallback
async function handleHTMLRequest(request) {
  try {
    console.log('Service Worker: Fetching HTML from network', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url);
    
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      console.log('Service Worker: Returning offline page');
      return caches.match(OFFLINE_URL);
    }
    
    // For other HTML requests, return a basic offline response
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - FixMyPhone</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <h1>You're Offline</h1>
          <p class="offline">Please check your internet connection and try again.</p>
        </body>
      </html>`,
      { 
        status: 200, 
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Handle static assets - Cache First
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('Service Worker: Serving static asset from cache', request.url);
    return cachedResponse;
  }
  
  try {
    console.log('Service Worker: Fetching static asset from network', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch static asset', request.url, error);
    
    // Return a placeholder for failed image requests
    if (request.url.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="14" fill="#999">Image Unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle API requests - Network First with Cache Fallback
async function handleAPIRequest(request) {
  try {
    console.log('Service Worker: Fetching API from network', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache GET requests only
      if (request.method === 'GET') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API network failed, trying cache', request.url);
    
    // Only return cached response for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return offline API response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection',
        offline: true
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle generic requests
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-repair-submission') {
    event.waitUntil(syncRepairSubmissions());
  }
});

// Sync repair submissions when back online
async function syncRepairSubmissions() {
  try {
    console.log('Service Worker: Syncing repair submissions');
    
    // Get offline submissions from IndexedDB
    const offlineSubmissions = await getOfflineSubmissions();
    
    for (const submission of offlineSubmissions) {
      try {
        const response = await fetch('/api/repair-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          await removeOfflineSubmission(submission.id);
          console.log('Service Worker: Synced submission', submission.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync submission', submission.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// IndexedDB helpers (placeholder - would need proper implementation)
async function getOfflineSubmissions() {
  // Implementation would use IndexedDB to store/retrieve offline data
  return [];
}

async function removeOfflineSubmission(id) {
  // Implementation would remove synced data from IndexedDB
  console.log('Removing offline submission:', id);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'Your repair status has been updated',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FixMyPhone Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Script loaded successfully');