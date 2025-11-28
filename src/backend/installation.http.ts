/**
 * Wix App Installation Handler
 * This endpoint is called when the app is installed to a site
 * URL: https://{your-app-domain}/api/wix
 */

export async function get(request: any) {
  const token = request.query?.token;
  
  console.log('App installation initiated', { token });
  
  // You can store installation data, set up initial configuration, etc.
  
  return {
    status: 200,
    body: {
      success: true,
      message: 'App installed successfully',
      timestamp: new Date().toISOString(),
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export async function post(request: any) {
  const token = request.query?.token;
  const body = await request.body?.json?.() || {};
  
  console.log('App installation POST', { token, body });
  
  return {
    status: 200,
    body: {
      success: true,
      message: 'App installation processed',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
