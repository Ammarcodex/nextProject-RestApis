export function logMiddleware(request : Request) {
    return {Response: request.method + " " + request.url + " Yes"}

}