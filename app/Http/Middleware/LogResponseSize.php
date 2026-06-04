<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogResponseSize
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
    public function terminate(Request $request, Response $response): void
    {
        $size = strlen($response->getContent());
        logger()->info('Response size', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'size_bytes' => $size,
        ]);
    }
}
