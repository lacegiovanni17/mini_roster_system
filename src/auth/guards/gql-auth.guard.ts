import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    /**
     * Overrides the default `getRequest` method from `AuthGuard` to extract the
     * HTTP request object from a GraphQL execution context.
     *
     * In a GraphQL application, the `ExecutionContext` provided by NestJS is
     * generic. This method uses `GqlExecutionContext.create(context)` to
     * transform it into a GraphQL-specific context.
     *
     * It then accesses the `context` object (which typically holds the
     * original HTTP request and response) and returns the `req` property,
     * allowing the underlying JWT strategy to process the request headers
     * for authentication.
     *
     * @param context The generic NestJS execution context.
     * @returns The HTTP request object.
     */
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
