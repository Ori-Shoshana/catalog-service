import { Response } from 'express';

export function handleError(res: Response, err: unknown) {
  console.error(' [Error Handler] Logged Error:', err);
  
  const dbError = err as { code?: string; message?: string };

    if (dbError.code === '23502') { 
    return res.status(400).json({ 
      status: 'error',
      message: 'Missing required field in database', 
      detail: dbError.message 
    });
  }

  if (dbError.code === '22P02') { 
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid input syntax', 
      detail: dbError.message 
    });
  }

  if (dbError.code === 'XX000') { 
    return res.status(400).json({ 
      status: 'error',
      message: 'Invalid Geometry/GeoJSON format', 
      detail: dbError.message 
    });
  }

  res.status(500).json({ 
    status: 'error',
    message: 'Internal server error' 
  });
}