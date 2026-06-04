<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogResponseTime
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $response = $next($request);
        $endTime = microtime(true);
        $duration = $endTime - $startTime;
        logger()->info('Request duration', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'duration_ms' => round($duration * 1000, 2),
        ]);
        return $response;
    }
}
