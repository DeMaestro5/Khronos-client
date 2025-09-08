import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const base =
    process.env.SERVER_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://khronos-api-bp71.onrender.com';

  const apiKey = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || '';
  const authHeader = req.headers.get('authorization') || '';

  // Enhanced debug logging
  console.log('=== YouTube Connect Proxy Debug ===');
  console.log('Base URL:', base);
  console.log('API Key present:', !!apiKey);
  console.log('API Key length:', apiKey.length);
  console.log(
    'API Key value (first 10 chars):',
    apiKey.substring(0, 10) + '...'
  );
  console.log('Auth header present:', !!authHeader);
  console.log(
    'Auth header preview:',
    authHeader ? authHeader.substring(0, 20) + '...' : 'none'
  );
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);

  if (!apiKey) {
    console.error('❌ No API key found in environment variables');
    return NextResponse.json(
      {
        error: 'No API key configured on server',
        env: process.env.NODE_ENV,
        availableEnvVars: {
          API_KEY: !!process.env.API_KEY,
          NEXT_PUBLIC_API_KEY: !!process.env.NEXT_PUBLIC_API_KEY,
          SERVER_API_URL: !!process.env.SERVER_API_URL,
          NEXT_PUBLIC_API_URL: !!process.env.NEXT_PUBLIC_API_URL,
        },
      },
      { status: 500 }
    );
  }

  const commonHeaders: Record<string, string> = {
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
    ...(authHeader ? { Authorization: authHeader } : {}),
  };

  console.log('Headers being sent to backend:', commonHeaders);

  const toAbsolute = (u: string) =>
    /^https?:\/\//i.test(u) ? u : `${base}${u.startsWith('/') ? '' : '/'}${u}`;

  const isBackendUrl = (u: string) => toAbsolute(u).startsWith(base);

  const upstreamUrl = `${base}/api/v1/platforms/youtube/connect`;
  console.log('Calling upstream:', upstreamUrl);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: commonHeaders,
      redirect: 'manual',
    });

    console.log('Upstream response status:', upstream.status);
    console.log('Upstream response statusText:', upstream.statusText);
    console.log(
      'Upstream response headers:',
      Object.fromEntries(upstream.headers.entries())
    );

    // Handle different status codes
    if (upstream.status === 400) {
      const errorText = await upstream.text();
      console.error('❌ Backend returned 400 Bad Request:', errorText);
      return NextResponse.json(
        {
          error: 'Backend API key validation failed',
          details: errorText,
          status: upstream.status,
          headers: Object.fromEntries(upstream.headers.entries()),
        },
        { status: 400 }
      );
    }

    if (upstream.status === 401) {
      const errorText = await upstream.text();
      console.error('❌ Backend returned 401 Unauthorized:', errorText);
      return NextResponse.json(
        {
          error: 'Backend authentication failed',
          details: errorText,
          status: upstream.status,
        },
        { status: 401 }
      );
    }

    const location = upstream.headers.get('location');
    if (location) {
      console.log('✅ Got location header:', location);
      return NextResponse.json({ url: toAbsolute(location) }, { status: 200 });
    }

    // Try to parse JSON response
    const responseText = await upstream.text();
    console.log('Raw upstream response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText) as {
        redirectUrl?: string;
        url?: string;
        error?: string;
        message?: string;
      };
      console.log('Parsed upstream JSON response:', data);
    } catch (parseError) {
      console.error(
        '❌ Failed to parse upstream response as JSON:',
        parseError
      );
      return NextResponse.json(
        {
          error: 'Invalid response from backend',
          status: upstream.status,
          body: responseText,
          parseError:
            parseError instanceof Error
              ? parseError.message
              : 'Unknown parse error',
        },
        { status: 502 }
      );
    }

    // Handle error responses from backend
    if (data.error || data.message) {
      console.error('❌ Backend returned error:', data);
      return NextResponse.json(
        {
          error: data.error || data.message || 'Unknown backend error',
          status: upstream.status,
          details: data,
        },
        { status: upstream.status }
      );
    }

    const nextHopRaw = data?.redirectUrl || data?.url;
    const nextHop = nextHopRaw ? toAbsolute(nextHopRaw) : undefined;

    // Follow if the next hop points to our backend (absolute or relative)
    if (nextHop && isBackendUrl(nextHop)) {
      console.log('Following backend URL:', nextHop);
      const follow = await fetch(nextHop, {
        method: 'GET',
        headers: commonHeaders,
        redirect: 'manual',
      });
      const followLoc = follow.headers.get('location');
      if (followLoc) {
        console.log('Follow got location:', followLoc);
        return NextResponse.json(
          { url: toAbsolute(followLoc) },
          { status: 200 }
        );
      }
      try {
        const followData = (await follow.json()) as {
          redirectUrl?: string;
          url?: string;
        };
        const finalUrl = followData?.redirectUrl || followData?.url;
        if (finalUrl) {
          console.log('Follow got final URL:', finalUrl);
          return NextResponse.json(
            { url: toAbsolute(finalUrl) },
            { status: 200 }
          );
        }
        const followText = await follow.text();
        console.log('Follow failed - no URL in response:', followText);
        return NextResponse.json(
          {
            error: 'No redirect URL from backend (follow)',
            status: follow.status,
            body: followText,
          },
          { status: 502 }
        );
      } catch {
        const followText = await (
          await fetch(nextHop, { headers: commonHeaders })
        ).text();
        console.log('Follow parse error:', followText);
        return NextResponse.json(
          {
            error: 'No redirect URL from backend (follow parse)',
            status: 502,
            body: followText,
          },
          { status: 502 }
        );
      }
    }

    if (nextHop) {
      console.log('✅ Returning external URL:', nextHop);
      return NextResponse.json({ url: nextHop }, { status: 200 });
    }

    console.log('❌ No redirect URL found. Response body:', responseText);
    return NextResponse.json(
      {
        error: 'No redirect URL from backend',
        status: upstream.status,
        body: responseText,
      },
      { status: 502 }
    );
  } catch (fetchError) {
    console.error('❌ Network error calling backend:', fetchError);
    return NextResponse.json(
      {
        error: 'Network error calling backend',
        details:
          fetchError instanceof Error
            ? fetchError.message
            : 'Unknown network error',
        upstreamUrl,
      },
      { status: 502 }
    );
  }
}
